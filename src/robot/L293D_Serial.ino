#define MOTOR_EN_1_2  10
#define MOTOR_IN1     9
#define MOTOR_IN2     8

#define MOTOR_EN_3_4  6
#define MOTOR_IN3     5
#define MOTOR_IN4     3

#define slow 64
#define normal 128
#define fast 255

int Speed; 
 
void forward(int motor){
  if(motor == 1) {
    analogWrite(MOTOR_EN_1_2, Speed);
    digitalWrite(MOTOR_IN1, HIGH);
    digitalWrite(MOTOR_IN2, LOW);
  } else {
    analogWrite(MOTOR_EN_3_4, Speed);
    digitalWrite(MOTOR_IN3, HIGH);
    digitalWrite(MOTOR_IN4, LOW);
  }
}
 
void backward(int motor){
  if(motor == 1) {
    analogWrite(MOTOR_EN_1_2, Speed);
    digitalWrite(MOTOR_IN1, LOW);
    digitalWrite(MOTOR_IN2, HIGH);
  } else {
    analogWrite(MOTOR_EN_3_4, Speed);
    digitalWrite(MOTOR_IN3, LOW);
    digitalWrite(MOTOR_IN4, HIGH);
  }
  
}

void brake(int motor){
 if(motor == 1) {
  digitalWrite(MOTOR_IN1, HIGH);
  digitalWrite(MOTOR_IN2, HIGH);
 } else {
  digitalWrite(MOTOR_IN3, HIGH);
  digitalWrite(MOTOR_IN4, HIGH);
 }
}

void moveForward() {
  forward(1);
  forward(2);
}

void moveBackward() {
  backward(1);
  backward(2);
}

void turnLeft() {
  forward(2);
  brake(1);
}

void turnRight() {
  forward(1);
  brake(2);
}

void stopMoving() {
  brake(1);
  brake(2);
}

void setup() {
  Serial.begin(9600);
  pinMode(MOTOR_EN_1_2, OUTPUT);
  pinMode(MOTOR_IN1, OUTPUT);
  pinMode(MOTOR_IN2, OUTPUT);
  pinMode(MOTOR_EN_3_4, OUTPUT);
  pinMode(MOTOR_IN3, OUTPUT);
  pinMode(MOTOR_IN4, OUTPUT);
}
 
void loop() {
 
  Speed=fast; // Normal Speed
 
  if (Serial.available() > 0) {
    char command = Serial.read();
    switch (command) {
      case '1':
        moveForward();
        break;
      case '2':
        turnRight();
        break;
      case '3':
        moveBackward();
        break;
      case '4':
        turnLeft();
        break;
      case '5':
        stopMoving();
        break;
      default:
        break;
    }
  }
  
}
