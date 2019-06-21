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

def constrain(x, a, b):
    if(a <= x and x <= b):
        return x
    if(x < a):
        return a
    return b

ser = serial.Serial('/dev/ttyMCC', 9600, timeout=0)

axisOffset = array('i', [])

# G_scaleRange = 250, FsDouble = 1 (enabled)
# A_scaleRange = 2, lnoise = 1 (on)
magum = Magum(250, 1, 2, 1)

axisOffset = magum.calibrateSens(1000)
DT = 0.3

Kp = 20.0
Ki = 0.0
Kd = 0.0
setpoint = 0.0
pid = PID(Kp, Ki, Kd, setpoint)
value = setpoint
 
while True:
    time.sleep(DT)
    readPID(Kp, Ki, Kd)
    pid.tunnings = (Kp, Ki, Kd)
    try:
        cFAngleAxis = magum.compFilter(DT, axisOffset)
    except IOError:
        pass
    output = pid(int(round(cFAngleAxis[0],0)))
    output = constrain(output, 180, 255)
    ser.write((str(output)+'\r\n').encode())
    print str(int(round(cFAngleAxis[0],0))) + ',' + str(int(round(cFAngleAxis[1],0))) + ',' + str(int(round(cFAngleAxis[2],0)))
    print output
    
