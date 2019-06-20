from simple_pid import PID
import time

def control(output):
    print output
    f = open("angles.txt", "r")
    angles = f.read().replace('\n','').split(' ')
    f.close()
    print angles
    return float(angles[0])

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
Kp = 1.0
Ki = 0.0
Kd = 0.0
setpoint = 90.0
pid = PID(Kp, Ki, Kd, setpoint)

value = setpoint
while True:
    readPID(Kp, Ki, Kd)
    pid.tunnings = (Kp, Ki, Kd)
    output = pid(value)
    value = control(output)
    time.sleep(0.02)
