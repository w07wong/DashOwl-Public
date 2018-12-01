import cv2
vidcap = cv2.VideoCapture('train_output.mp4')
success,image = vidcap.read()
count = 0
while success:
  success,image = vidcap.read()
  if count%30 == 0:
	  cv2.imwrite('noncrashes/output' + str(count) + '.jpg', image)
  print('Read a new frame: ', success)
  count += 1
