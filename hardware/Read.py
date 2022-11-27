from time import sleep
import sys
from SimpleMFRC522 import SimpleMFRC522
import socketio
import RPi.GPIO as GPIO

reader = SimpleMFRC522()
sio = socketio.Client()

def getserial():
    # Extract serial from cpuinfo file
    cpuserial = "0000000000000000"
    try:
      f = open('/proc/cpuinfo','r')
      for line in f:
        if line[0:6]=='Serial':
          cpuserial = line[10:26]
      f.close()
    except:
      cpuserial = "ERROR000000000"
 
    return cpuserial

@sio.event
def connect():
    print('connection established')
    myserial = getserial()
    print('joining session: %s' % myserial)
    sio.emit('join', myserial)

@sio.event
def disconnect():
    print('disconnected from server')

sio.connect("https://odradek.dcvz.io")

try:
    while True:
        print("Hold a tag near the reader")
        id, text = reader.read()
        print("ID: %s\nText: %s" % (id, text[-11:]))
        sio.emit('transmit-event', text)
        sleep(5)
except KeyboardInterrupt:
    GPIO.cleanup()
    raise
