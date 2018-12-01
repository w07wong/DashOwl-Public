from flask import Flask, request, session, g, redirect, \
    url_for, abort, render_template, flash
from flask_socketio import SocketIO, emit
import json


app = Flask(__name__)
app.config.from_envvar('APP_CONFIG_FILE', silent=True)
socketio = SocketIO(app)

MAPBOX_ACCESS_KEY =  'pk.eyJ1Ijoia2thbHkiLCJhIjoiY2pubGZmcnk3MDc0ZDNwbzVjaTNrbjd4eiJ9.SUIRuCbVWhx3aED4pvgSEg'

# server.py

@app.route('/mapbox_js')
def mapbox_js():
    MAPBOX_ACCESS_KEY = 'pk.eyJ1Ijoia2thbHkiLCJhIjoiY2pubGZmcnk3MDc0ZDNwbzVjaTNrbjd4eiJ9.SUIRuCbVWhx3aED4pvgSEg'
    return render_template(
        'mapbox_js.html',
        ACCESS_KEY=MAPBOX_ACCESS_KEY
    )

@app.route('/mapbox_gl')
def mapbox_gl():
    return render_template(
        'mapbox_gl.html',
        ACCESS_KEY=MAPBOX_ACCESS_KEY
    )

@socketio.on('connect', namespace='/coord')
def connect_alert():
    # need visibility of the global thread object
    print('Web Client connected')

@socketio.on('newcoord', namespace='/coord')
def recieve_coord(data):
    print(data)
    with open('coord.json', 'w') as outfile:
        json.dump(data, outfile)

if __name__ == '__main__':
    socketio.run(app)