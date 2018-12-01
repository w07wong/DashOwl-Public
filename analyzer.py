import os
import Classifier
from ConnectToGoogleCloudStorage import upload_vid
from functools import wraps
from concurrent.futures import ThreadPoolExecutor
from subprocess import call

_DEFAULT_POOL = ThreadPoolExecutor()
def threadpool(f, executor=None):
    @wraps(f)
    def wrap(*args, **kwargs):
        return (executor or _DEFAULT_POOL).submit(f, *args, **kwargs)

    return wrap

#@threadpool
def analyzer(filename, meta_file):
    #Classifier.classifyMP4(filename)
    if Classifier.classifyMP4(filename):
        #print ("ok i upload to clowd")
        call(['ffmpeg', '-y', '-i', filename, 'uploadfile.mp4'])
        upload_vid('uploadfile.mp4', meta_file)
    #else:
        #print("no clowd leleelelelele")
    print("delete")
 #   delete_file(filename)
 #   delete_file(meta_file)

def delete_file(filename):
    os.remove(filename)
