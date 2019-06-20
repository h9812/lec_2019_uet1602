import socketio
import time
import robot
# import cv2
import base64

sio = socketio.Client()
sio.connect('http://uet1602.herokuapp.com')
# sio.connect('http://192.168.1.110:3000')
print("Connect to socket server ok")

robot.init()
directs = ['', 'W', 'D', 'S', 'A']

# cameraOn = False
# FPS = 10.0

# vcap = cv2.VideoCapture(0)
# print("Connect webcam ok")

sio.emit('robot-res-join', '')

@sio.on('connect')
def on_connect():
    print('I\'m connected!')
    sio.emit('robot-res-join', '')

# STREAM PING
@sio.on('robot-ping')
def on_ping(server_timestamp):
    sio.emit('robot-res-ping', server_timestamp)

# CONTROL CAMERA ON/OFF
@sio.on('robot-ctrl-cam')
def on_cam(onOff):
    print("server => "+('turn on' if onOff  else 'turn off')+ " camera")
    cameraOn = onOff
#     if onOff:
#         vcap.release()
#         vcap.open(0)
#         vcap.set(cv2.CAP_PROP_FRAME_WIDTH, 50)
#         vcap.set(cv2.CAP_PROP_FRAME_HEIGHT, 50)
#     while cameraOn:
#         print('streaming...')
#         ret, frame = vcap.read()
#         if not ret:
#             print("Camera is disconnected!")
#             vcap.release()
#             return False
#         else:
#             image = cv2.imencode('.jpg', frame)[1]
#             img64 = base64.encodestring(image)
#             sio.emit('robot-res-webcam', img64)
#             time.sleep(1.0/FPS)
#     if not cameraOn:
#         vcap.release()

# CONTROL LEFT/RIGHT UP/DOWN
@sio.on('robot-config')
def on_config(config):
    configVar = config[0]
    configVal = int(config[1:])
    print('Robot config '+configVar+' : '+str(configVal))

# CONTROL LEFT/RIGHT UP/DOWN
@sio.on('robot-control-start')
def on_control_start(direct):
    directNum = directs.index(direct)
    print('Robot start go '+str(directNum))
    robot.robotSocketStartMove(directNum)

@sio.on('robot-control-end')
def on_control_end(direct):
    directNum = directs.index(direct)
    print('Robot stop go '+str(directNum))
    robot.robotSocketEndMove(directNum)

# CONTROL WITH CUSTOM ROUTE
@sio.on('robot-route')
def on_route(route):
    if route == 'stop':
        print('Robot STOP go route ')
        robot.robotStopTraveling()
    else:
        print('Robot go route: '+str(route))
        robot.robotTravel(route)

@sio.on('disconnect')
def on_disconnect():
    print('I\'m disconnected!')
    # vcap.release()
    # cv2.destroyAllWindows()

print('Running...')