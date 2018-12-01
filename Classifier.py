# USAGE

# import the necessary packages
from keras.preprocessing.image import img_to_array
from keras.models import load_model
import numpy as np
import argparse
import imutils
import cv2

# load the trained convolutional neural network
print("[INFO] loading network...")
model = load_model("accident_not_accident.model")

frameData = []
'''output 1 if accident, 0 if none'''
def classifyMP4(videoFile):
	try:
		vidcap = cv2.VideoCapture(videoFile) #VIDEOFILE IS A STRING
		success,image = vidcap.read()
		count=0
		while success:
			count+=1
			success,image = vidcap.read()
			if count%5 == 0:
				try:
					saved = image

					image = cv2.resize(image, (28, 28))
					image = image.astype("float") / 255.0
					image = img_to_array(image)
					image = np.expand_dims(image, axis=0)
				except:
					print('error')
				(notSanta, santa) = model.predict(image)[0]
				if santa > notSanta and santa*100>96:
					print ("We've detected a crash at frame " + str(count) + "with certainty: " + str(santa*100) + "%")
					frameData.append(1)
					#return 1
				else:
					frameData.append(0)
					print("NO CRASH AT THIS FRAME!")

		'''now check if there's actually a crash or false positive...'''
		crash = False
		for i in range(0, len(frameData)-20):
			smallList = frameData[i:i+19]
			total = 0
			for value in smallList:
				if value == 1:
					total += 1
			if total>10:
				crash=True

		if crash:
			print("OVERALL SENTIMENT: CRASH")
			return 1
		else:
			print("OVERAL SENTIMENT: NO CRASH")
			return 0
	except:
		crash = False
		for i in range(0, len(frameData)-20):
			smallList = frameData[i:i+19]
			total = 0
			for value in smallList:
				if value == 1:
					total += 1
			if total>10:
				crash=True

		if crash:
			print("OVERALL SENTIMENT: CRASH")
			return 1
		else:
			print("OVERAL SENTIMENT: NO CRASH")
			return 0
