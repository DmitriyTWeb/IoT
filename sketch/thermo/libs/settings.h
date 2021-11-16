#pragma once

#include "./eepromlib.h"
int SSID_EEPROM_ADDR_START = 32;
int SSID_EEPROM_ADDR_END = 64;
int PASS_EEPROM_ADDR_START = 64;
int PASS_EEPROM_ADDR_END = 128;

byte MODE_ADDR = 0;
byte TEMP_IN_ADDR = 4;
byte TEMP_OUT_ADDR = 8;
byte TEMP_DELTA_ADDR = 12;

// ========================================================
// export part
// --------------------------------------------------------
bool writeSSID(String ssid) {
  Serial.println("Saving SSID to EEPROM");

  int length = ssid.length() + 1;
  int maxLength = SSID_EEPROM_ADDR_END - SSID_EEPROM_ADDR_START;
  if (length > maxLength) {
    Serial.print("Max SSID length exceeded. Max SSID length is: ");
    Serial.println(maxLength);
    Serial.print("But received SSID of length: ");
    Serial.println(length);
    return false;
  }

  char buf[length];
  char stringChar[length];

  ssid.toCharArray(stringChar, length);
  strcpy(buf, stringChar);
  eepromWriteString(SSID_EEPROM_ADDR_START, buf);

  return true;
}
bool writePASS(String pass) {
  Serial.println("Saving PASS to EEPROM");

  int length = pass.length() + 1;
  int maxLength = PASS_EEPROM_ADDR_END - PASS_EEPROM_ADDR_START;
  if (length > maxLength) {
    Serial.print("Max PASS length exceeded. Max PASS length is: ");
    Serial.println(maxLength);
    Serial.print("But received PASS of length: ");
    Serial.println(length);
    return false;
  }

  char buf[length];
  char stringChar[length];

  pass.toCharArray(stringChar, length);
  strcpy(buf, stringChar);
  eepromWriteString(PASS_EEPROM_ADDR_START, buf);

  return true;
}

String readSSID() {
  Serial.println("Reading SSID from EEPROM");

  int readingLength = SSID_EEPROM_ADDR_END - SSID_EEPROM_ADDR_START;
  char buf[readingLength];

  eepromReadString(SSID_EEPROM_ADDR_START, buf, readingLength);
  Serial.print("Reading SSID from address: ");
  Serial.println(SSID_EEPROM_ADDR_START);

  return (String)buf;
}
String readPASS() {
  Serial.println("Reading PASS from EEPROM");

  int readingLength = PASS_EEPROM_ADDR_END - PASS_EEPROM_ADDR_START;
  char buf[readingLength];

  eepromReadString(PASS_EEPROM_ADDR_START, buf, readingLength);
  Serial.print("Reading PASS from address: ");
  Serial.println(PASS_EEPROM_ADDR_START);

  return (String)buf;
}

// ---------------------------------------
void readSettings() {
  EEPROM.get(MODE_ADDR, mode);
  EEPROM.get(TEMP_IN_ADDR, tempIn);
  EEPROM.get(TEMP_OUT_ADDR, tempOut);
  EEPROM.get(TEMP_DELTA_ADDR, tempDelta);
}
void writeSettings() {
  EEPROM.put(MODE_ADDR, mode);
  EEPROM.put(TEMP_IN_ADDR, tempIn);
  EEPROM.put(TEMP_OUT_ADDR, tempOut);
  EEPROM.put(TEMP_DELTA_ADDR, tempDelta);
  EEPROM.commit();
  Serial.println("Settings were written to EEPROM");
};