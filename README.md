# DashOwl
A CalHacks 5.0 Project

# Overview
Thousands of accidents happen on the road every day, but rarely is video footage available. As a result, victims have to endure drawn out court proceedings, authorities have to spend resources investigating, and insurance companies often falsely assign blame. 

With the advent of the connected car, almost every modern vehicle has a large suite of cameras that could serve as witness to accidents on the road. But there exists no system for vehicles in the vicinity of the accident to identify and share crash footage, and as such valuable video evidence never reaches the victims.

With DashOwl, we take a video stream, use a CNN ML model to detect whether the stream contains a crash, compile relevant parameters from the car's instrumentation using OpenXC, and upload footage and data to Google Cloud Storage and MongoDB. We provide a web portal for authorized personnel to query based on approximate location and time, view the accident footage, and study the OpenXC parameters in order to better visualize the scene leading up to the crash.

We trained the ML model using GTA V crashes and driving simulations, and tested the system live in the video linked below.

# To Run:
The hardware code is built to run on the Dragonboard 410c's aarch64 platform, but should compile on any platform that satisfies the dependencies. 
Dependencies include: python3.6, flask, ffmpeg, v4l-utils and uvc (webcam support), opencv, keras, tensorflow, numpy, scipy.

To run, make sure the USB webcam is plugged in and recognized by v4l-utils. Change the camera number in main.py to match:
-Main application: sh main.sh (in the root directory)
-Mapbox GPS coordinate provider: sh start.sh (in directory flask_mapbox. map is live at 127.0.0.1:5000/mapbox_gl )
-OpenXC emulator modified to provide parameters to our system: ./simulator.py (in directory /openxc_sim/openxc-vehicle-simulator )


The frontend's dependencies are all CDN'd, except MediaElementJS which has an installation procedure at their GitHub. PyMongo and Google Platform SDK have to be installed and environment variables have to be set. To run, set up a http server.
