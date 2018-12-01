import cv2

def try1():
    stream = cv2.VideoCapture(2)
    stream.set(6, cv2.VideoWriter_fourcc('Y','U', 'Y', 'V'))
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter('train_output.avi',fourcc, 20.0, (640,480))

    while(stream.isOpened()):
        ret, frame = stream.read()
        if ret==True:
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