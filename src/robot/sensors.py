from magum import Magum
from array import *
import time

axisOffset = array('i', [])

# G_scaleRange = 250, FsDouble = 1 (enabled)
# A_scaleRange = 2, lnoise = 1 (on)
magum = Magum(250, 1, 2, 1)

axisOffset = magum.calibrateSens(1000)
DT = 0.02
i = 0;
while True:
    try:
        cFAngleAxis = magum.compFilter(DT, axisOffset)
    except IOError:
        pass
    if i%20 == 0:
        print str(int(round(cFAngleAxis[0],0))) + ',' + str(int(round(cFAngleAxis[1],0))) + ',' + str(int(round(cFAngleAxis[2],0)))
        f = open("angles.txt", "w")
        f.write(str(float(round(cFAngleAxis[0],0))))
        f.write(" ")
        f.write(str(float(round(cFAngleAxis[1],0))))
        f.write(" ")
        f.write(str(float(round(cFAngleAxis[2],0))))
        f.close()
    i += 1