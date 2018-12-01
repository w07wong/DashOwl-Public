import cv2
import numpy as np
import os

directory = 'images/not_santa/'
for filename in os.listdir(directory):
	if filename.endswith(".png") or filename.endswith(".jpg"):
		img = cv2.imread(directory+filename,0)
		kernel = np.ones((3,3))
		ret,threshold = cv2.threshold(np.uint8(img),0,60000,cv2.THRESH_BINARY)
		erosion = cv2.erode(img,kernel,iterations = 6) #increase if necessary
		dilation = cv2.dilate(erosion,kernel,iterations = 4)
		cv2.imwrite(directory+filename, dilation)
	else:
		continue
