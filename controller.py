from magum import Magum
from simple_pid import PID
from array import *
import serial
import time

def readPID(Kp, Ki, Kd):
    try:
        f = open("pid.cfg", "r")
        data = f.read().replace('\n','').split(' ')
        f.close()
        Kp = float(data[0])
        Ki = float(data[1])
        Kd = float(data[2])
        print "pid: " + str(Kp) + " " + str(Ki) + " " + str(Kd)
    except IOError:
        pass

def constrain(x):
    if(x < -255):
        return -255
    if(x > 255):
        return 255
    
    return x
    

ser = serial.Serial('/dev/ttyMCC', 115200, timeout=0)

axisOffset = array('i', [])

# G_scaleRange = 250, FsDouble = 1 (enabled)
# A_scaleRange = 2, lnoise = 1 (on)
magum = Magum(250, 1, 2, 1)

axisOffset = magum.calibrateSens(40)
DT = 0.1

Kp = 20.0
Ki = 1.5
Kd = 0.0
setpoint = 0.0
pid = PID(Kp, Ki, Kd, setpoint)
value = setpoint
pid.tunnings = (Kp, Ki, Kd)
while True:
    time.sleep(DT)
    #readPID(Kp, Ki, Kd)
    #pid.tunnings = (Kp, Ki, Kd)
    try:
        cFAngleAxis = magum.kalmanFilter(DT,'z', axisOffset)
    except IOError:
        pass
    output = pid(int(cFAngleAxis))#0
    output = constrain(output)
    ser.write((str(output)+'\r\n').encode())
    print str(int(round(cFAngleAxis[0],0))) + ',' + str(int(round(cFAngleAxis[1],0))) + ',' + str(int(round(cFAngleAxis[2],0)))
    print output
    
