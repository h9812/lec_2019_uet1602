#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27,16,2);

void setup() {
  Serial.begin(9600);
  lcd.begin();
  lcd.backlight();
}
 
void loop() {
  int number = Serial.parseInt();
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print(number);
}