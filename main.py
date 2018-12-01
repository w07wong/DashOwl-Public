import cv2
from functools import wraps
from concurrent.futures import ThreadPoolExecutor
from analyzer import analyzer
import json
import datetime

_DEFAULT_POOL = ThreadPoolExecutor()
def threadpool(f, executor=None):
    @wraps(f)
    def wrap(*args, **kwargs):
        return (executor or _DEFAULT_POOL).submit(f, *args, **kwargs)

    return wrap



MAX_ITER = 5
MAX_VIDEO_FRAME_COUNT = 575

def try1():
    stream = cv2.VideoCapture(2)
    stream.set(6, cv2.VideoWriter_fourcc('Y','U', 'Y', 'V'))
    fourcc = cv2.VideoWriter_fourcc('H','2', '6', '4')
    out = cv2.VideoWriter('output.avi',fourcc, 20.0, (640,480))

    while(stream.isOpened()):
        ret, frame = stream.read()
        if ret==True:
            print("am run")
            out.write(frame)
            cv2.imshow('frame',frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        else:
            break

    # Release everything if job is finished
    stream.release()
    out.release()
    cv2.destroyAllWindows()

def main():
    stream = cv2.VideoCapture(0)
    stream.set(6, cv2.VideoWriter_fourcc('Y', 'U', 'Y', 'V'))

    fourcc = cv2.VideoWriter_fourcc('H','2', '6', '4')
    iter = 0

    while (iter < MAX_ITER):
        out = cv2.VideoWriter('output_' + str(iter) + '.avi', fourcc, 20.0, (640,480))
        frame_count = 0
        while (frame_count < MAX_VIDEO_FRAME_COUNT):
            ret, frame = stream.read()
            if ret==True:
                out.write(frame)
                frame_count += 1
            else:
                break

        out.release()
        with open('flask_mapbox/coord.json') as f:
            data = json.load(f)
        with open('state.json') as f:
            state_data = json.load(f)
        with open('meta_'+ str(iter) +'.json', 'w') as outfile:
            json.dump({'lat' : data['lat'],
                       'lon' : data['lon'],
                       'time' : str(datetime.datetime.utcnow().isoformat() + 'Z'),
                       'accelerator' : state_data['accelerator'],
                       'brake' : state_data['brake'],
                       'high_beam' : state_data['high_beam'],
                       'headlamp' : state_data['headlamp'],
                       'windshield_wiper' : state_data['windshield_wiper']}
                      , outfile)
        analyzer('output_' + str(iter) + '.avi', 'meta_'+ str(iter) +'.json')
        iter += 1

    # Release everything if job is finished
    stream.release()
    cv2.destroyAllWindows()
