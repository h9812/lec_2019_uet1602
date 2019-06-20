#Udoo: Python Client for self-balanced-car

1. Install **virtualenv** and **pip3**
    - sudo apt-get install virtualenv
    - sudo apt-get install python3-pip 

2. Setup python3 enviroment
    - virtualenv -p /usr/bin/python3 py3 
    - cd py3/bin
    - source activate
3. Install python package
    1. sudo pip3 install --index-url=https://www.piwheels.org/simple opencv-python
    2. sudo pip3 install "python-socketio[client]"
        - You might face SyntaxError problems, just ignore it, it's normal
        - What you need to do is making sure that successfully-installed message is showed in your screen
    3. sudo pip3 install pyserial
4. Upload L293D_Serial.ino to M4 Core; Wiring M4, IC, motors.
![Wiring Diagram](Wiring%20L293D.png)
5. Start it
    1. cd ~/lec_2019_uet1602/src/robot
    2. python3 client.io.py
