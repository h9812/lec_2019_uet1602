import serial
import time

ser = serial.Serial('COM4', 9600, timeout=0)
o1 = 120
o2 = 240
while True:
    time.sleep(0.3)
    ser.write((str(o1)+'\r\n').encode())
    time.sleep(0.3)
    ser.write((str(o2)+'\r\n').encode())
    