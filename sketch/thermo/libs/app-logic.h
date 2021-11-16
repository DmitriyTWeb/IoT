#pragma once

#include "./settings.h";
#include "./variables.h"

void setDigitalPin(uint8_t pin, uint8_t newState) {
  int currentState =  digitalRead(pin);
  if (currentState != newState) {
    digitalWrite(pin, newState);
  }
}

void setPumpPin(String mode, String sensorStatus, float temp) {
  if (sensorStatus == "SENSOR_WORK") {
    if (mode == "IN") {
      if (temp < (tempIn - tempDelta)) {
        setDigitalPin(PUMP_PIN, HIGH);
      } else if (temp >= (tempIn + tempDelta)) {
        setDigitalPin(PUMP_PIN, LOW);
      }
    } else {
      if (temp < (tempOut - tempDelta)) {
        setDigitalPin(PUMP_PIN, HIGH);
      } else if (temp >= (tempOut + tempDelta)) {
        setDigitalPin(PUMP_PIN, LOW);
      }
    }
  } else {
    digitalWrite(PUMP_PIN, LOW);
  }
}
float getTempCelsius() {
  // Переменные для преобразования сопротивления в температуру
  const double VCC = 3.3;
  const double R0 = 100000;
  const double ADC_RESOLUTION = 1023;

  const double B = 3950;
  const double T0 = 298.15; // в Кельвинах соответствует 25 град.Цельсия
  const double KELVIN = 273.15;

  double Vout, Rth, tempKelvin, adc_value, tempCelsuis;

  adc_value = analogRead(A0);

  Vout = (adc_value * VCC) / ADC_RESOLUTION;
  Rth = (VCC * R0 / Vout) - R0;

  tempKelvin = (1 / (1 / T0 + (1 / B) * log(Rth / R0))); // температура в Кельвинах
  tempKelvin = tempKelvin - KELVIN;
  tempCelsuis = round(tempKelvin * 10) / 10; // текущее значение температуры в град

  return tempCelsuis;
}
String getSensorStatus(float temp) {
  String state;
  if (temp < -55 || temp > 125) {
    state = "SENSOR_BROKEN";
  } else {
    state = "SENSOR_WORK";
  }

  return state;
}
// ========================================================
// export part
// --------------------------------------------------------
void updateDeviceState() {
  currentTemp = getTempCelsius();
  sensorStatus = getSensorStatus(currentTemp);
  pumpState = digitalRead(PUMP_PIN);
}

void controlMainLogic() {
  updateDeviceState();
  setPumpPin(mode, sensorStatus, currentTemp);
}
void loadSettings() {
  readSettings();
}