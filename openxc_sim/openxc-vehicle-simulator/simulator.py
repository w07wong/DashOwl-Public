#!/usr/bin/env python

# all the imports


from flask import Flask, request, session, redirect, url_for, \
        render_template, make_response
from contextlib import closing
import state_manager, json, os

# configuration
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

# create our little application :)
app = Flask(__name__)
app.config.from_object(__name__)

def _make_status_response(status):
    response = make_response()
    response.status_code = status
    return response

@app.route('/')
def vehicle_data():
     global gState
     return render_template('vehicle_controls.html', IP=gState.local_ip,
             accelerator=gState.accelerator_pedal_position,
             angle=gState.steering_wheel_angle,
             received_messages=list(reversed(gState.received_messages()))[:25])

@app.route('/stop', methods=['POST'])
def stop():
     #Stop the automatic updates
     session['updates_paused'] = True
     global gState
     gState.pause()
     return redirect(url_for('vehicle_data'))

@app.route('/single', methods=['POST'])
def single():
     #make a global socket
     global gState
     gState.update_once()
     return redirect(url_for('vehicle_data'))

@app.route('/start', methods=['POST'])
def start():
     #make a global socket
     session.pop('updates_paused', None)
     global gState
     gState.resume()
     return redirect(url_for('vehicle_data'))

@app.route('/custom-message', methods=['POST'])
def send_custom_message():
     name = request.form['custom_message_name']
     value = request.form['custom_message_value']
     event = request.form['custom_message_event']

     session['custom_message_name'] = name
     session['custom_message_value'] = value
     session['custom_message_event'] = event
     gState.send_callback(name, value, event)
     return redirect(url_for('vehicle_data'))

@app.route('/_set_data', methods=['POST'])
def set_data():
     global gState

     name = request.form['name']

     if name == "angle":
          gState.steering_wheel_angle = float(request.form['value'])
     elif name == "accelerator":
          gState.accelerator_pedal_position = float(request.form['value'])
     elif name == "brake":
          gState.brake_pedal_position = float(request.form['value'])
     elif name == "parking_brake_status":
          gState.parking_brake_status = python_bool(request.form['value'])
     elif name == "ignition_status":
          gState.ignition_status = request.form['value']
     elif name == "manual_trans_status":
          gState.manual_trans_status = python_bool(request.form['value'])
     elif name == "headlamp_status":
          gState.headlamp_status = python_bool(request.form['value'])
     elif name == "high_beam_status":
          gState.high_beam_status = python_bool(request.form['value'])
     elif name == "windshield_wiper_status":
          gState.windshield_wiper_status = python_bool(request.form['value'])
     elif name == "door_status":
          gState.update_door(request.form['value'], python_bool(
               request.form['event']))
     elif name == "gear_lever_position":
          gState.gear_lever_position = request.form['value']
     elif name == "latitude":
          gState.latitude = float(request.form['value'])
     elif name == "longitude":
          gState.longitude = float(request.form['value'])
     elif name == "upshift":
          gState.upshift()
     elif name == "downshift":
          gState.downshift()
     else:
          print("Unsupported data received from UI: " + str(request.form))
     log_data()
     return _make_status_response(201)

def log_data():
     global gState
     exists = os.path.isfile('../../state.json')

     data_none = False
     data = {}
     if exists:
          with open('../../state.json') as f:
               data = json.load(f)
               data_none = False
          if data is None:
               data = {}
               data_none = True
     print(data_none)
     print(data)
     blank = [0,0,0,0,0,0,0,0,0]
     data['headlamp'] = gState.headlamp_status
     data['high_beam'] = gState.high_beam_status
     data['windshield_wiper'] = gState.windshield_wiper_status
     if (not data_none) and ("brake" in data) and (data["brake"] is not None):
          existing = data["brake"]
          existing.append((int(gState.brake_pedal_position)))
          existing = existing[1:11]
          data["brake"] = existing
          #data['brake'] = blank

          #data['brake'] = [1,2]
     else:
          data["brake"] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          #data['brake'] = blank.append(gState.brake_pedal_position)
     if (not data_none) and ("accelerator" in data) and (data["accelerator"] is not None):
          existing = data["accelerator"]
          existing.append((int(gState.accelerator_pedal_position)))
          existing = existing[1:11]
          data["accelerator"] = existing
          #data['accelerator'] = blank
     else:
          data['accelerator'] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
     with open('../../state.json', 'w') as outfile:
          json.dump(data, outfile)


def python_bool(value):
     if value == "true":
          return True
     if value == "false":
          return False
     else:
          return None

@app.route('/_get_data')
def get_data():
     return gState.dynamics_data

if __name__ == '__main__':
     global gState
     gState = state_manager.StateManager()

     flask_port = 50000

     print('For the UI, navigate a browser to localhost:' + str(flask_port))
     app.run(use_reloader=False, host='0.0.0.0', port=flask_port)
