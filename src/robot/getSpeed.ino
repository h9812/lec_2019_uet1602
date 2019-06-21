#define MOTOR_EN_1_2  10
#define MOTOR_IN1     9
#define MOTOR_IN2     8

#define MOTOR_EN_3_4  6
#define MOTOR_IN3     5
#define MOTOR_IN4     3

void move(int speed) {
    if(speed >= 0) {
        analogWrite(MOTOR_EN_1_2, speed);
        digitalWrite(MOTOR_IN1, LOW);
        digitalWrite(MOTOR_IN2, HIGH);
        analogWrite(MOTOR_EN_3_4, speed);
        digitalWrite(MOTOR_IN3, LOW);
        digitalWrite(MOTOR_IN4, HIGH);
    } else {
        speed = -speed;
        analogWrite(MOTOR_EN_1_2, speed);
        digitalWrite(MOTOR_IN1, HIGH);
        digitalWrite(MOTOR_IN2, LOW);
        analogWrite(MOTOR_EN_3_4, speed);
        digitalWrite(MOTOR_IN3, HIGH);
        digitalWrite(MOTOR_IN4, LOW);
    }
}

void brake(){
  digitalWrite(MOTOR_IN1, HIGH);
  digitalWrite(MOTOR_IN2, HIGH);
  digitalWrite(MOTOR_IN3, HIGH);
  digitalWrite(MOTOR_IN4, HIGH);
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
  int number = Serial.parseInt();
  move(number);
}