#define MOTOR_EN_1_2  10
#define MOTOR_IN1     9
#define MOTOR_IN2     8

#define MOTOR_EN_3_4  6
#define MOTOR_IN3     5
#define MOTOR_IN4     4

void move(int speed) {
  if(speed > 0) {
    analogWrite(MOTOR_EN_1_2, speed);
    digitalWrite(MOTOR_IN1, HIGH);
    digitalWrite(MOTOR_IN2, LOW);
    analogWrite(MOTOR_EN_3_4, speed);
    digitalWrite(MOTOR_IN3, HIGH);
    digitalWrite(MOTOR_IN4, LOW);
  } else {
    analogWrite(MOTOR_EN_1_2, -speed);
    digitalWrite(MOTOR_IN1, LOW);
    digitalWrite(MOTOR_IN2, HIGH);
    analogWrite(MOTOR_EN_3_4, -speed);
    digitalWrite(MOTOR_IN3, LOW);
    digitalWrite(MOTOR_IN4, HIGH);
  }
}

const byte numChars = 32;
char receivedChars[numChars];

boolean newData = false;

int dataNumber = 0;

void setup() {
    Serial.begin(9600);
}

void loop() {
    recvWithEndMarker();
    showNewNumber();
}

void recvWithEndMarker() {
    static byte ndx = 0;
    char endMarker = '\n';
    char rc;
   
    if (Serial.available() > 0) {
        rc = Serial.read();

        if (rc != endMarker) {
            receivedChars[ndx] = rc;
            ndx++;
            if (ndx >= numChars) {
                ndx = numChars - 1;
            }
        }
        else {
            receivedChars[ndx] = '\0';
            ndx = 0;
            newData = true;
        }
    }
}

void showNewNumber() {
    if (newData == true) {
        dataNumber = 0;
        dataNumber = atoi(receivedChars);
        Serial.println(dataNumber);
        move(dataNumber);
        newData = false;
    }
}