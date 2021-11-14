#pragma once

#include "EEPROM.h"
#include "./variables.h"

int EEPROM_SIZE = 512;
int SSID_EEPROM_ADDR_START = 32;
int SSID_EEPROM_ADDR_END = 64;
int PASS_EEPROM_ADDR_START = 64;
int PASS_EEPROM_ADDR_END = 128;

byte MODE_ADDR = 0;
byte TEMP_IN_ADDR = 4;
byte TEMP_OUT_ADDR = 8;
byte TEMP_DELTA_ADDR = 12;


// void readEEPROM(int startAdr, int maxLength, char* dest) {
//   EEPROM.begin(512);
//   delay(10);
//   for (int i = 0; i < maxLength; i++)
//     {
//       dest[i] = char(EEPROM.read(startAdr + i));
//     }
//   EEPROM.end();
//   Serial.print("ready reading EEPROM:");
//   Serial.println(dest);
// }
// void writeEEPROM(int startAdr, int laenge, char* writeString) {
//   // EEPROM.begin(512); //Max bytes of eeprom to use
//   // yield();
//   // Serial.println();
//   Serial.print("writing EEPROM: ");
//   //write to eeprom
//   for (int i = 0; i < laenge; i++)
//     {
//       EEPROM.write(startAdr + i, writeString[i]);
//       Serial.print(writeString[i]);
//     }
//   EEPROM.commit();
//   // EEPROM.end();
//   Serial.println("end of writing EEPROM");
// }
// // ========================================================
// // export part
// // --------------------------------------------------------
// String readSsidEeprom() {


//   // String ssid = "289ljlj";
//   // int ssidLength = SSID_EEPROM_ADDR_END - SSID_EEPROM_ADDR_START;
//   // char* ch;

//   // EEPROM.get(SSID_EEPROM_ADDR_START, ch);
//   // Serial.println("reading SSID from EEPROM...");
//   // for (int i = 0; i < ssidLength; ++i) {
//   //   int curAddr = SSID_EEPROM_ADDR_START + i;
//   //   ch[i] = EEPROM.read(curAddr);
//   //   Serial.println(curAddr);
//   //   Serial.println(ch[i]);
//   //   delay(100);
//   // }
//   // EEPROM.get(32, ssid);


//   // Serial.print("SSID: ");
//   // Serial.println(ch);
//   // ssid = (char*)ch;

//   return "empty return";
// }
// String readPassEeprom() {
//   String pass = "";
//   Serial.println("reading PASS from EEPROM...");
//   // EEPROM.get(PASS_EEPROM_ADDR_START, pass);

//   Serial.print("PASS: ");
//   Serial.println(pass);

//   // return pass;
// }
// // ---------------------------------------
// void writeSsidEeprom(String ssid) {
//   Serial.println("writing eeprom ssid: ");

//   for (int i = SSID_EEPROM_ADDR_START; i < ssid.length(); ++i) {
//     EEPROM.write(i, ssid[i]);
//     Serial.print("Wrote: ");
//     Serial.println(ssid[i]);
//   }
//   EEPROM.commit();
// }
// void writePassEeprom(String pass) {
//   Serial.println("writing eeprom pass: ");

//   for (int i = PASS_EEPROM_ADDR_START; i < pass.length(); ++i) {
//     EEPROM.write(i, pass[i]);
//     Serial.print("Wrote: ");
//     Serial.println(pass[i]);
//   }
//   EEPROM.commit();
// }
// // ---------------------------------------
// void clearSsidEeprom() {
//   Serial.println("clearing SSID from EEPROM");
//   for (int i = SSID_EEPROM_ADDR_START; i < SSID_EEPROM_ADDR_END; ++i) {
//     EEPROM.write(i, 0);
//   }
//   EEPROM.commit();
// }
// void clearPassEeprom() {
//   Serial.println("clearing PASS from EEPROM");
//   for (int i = PASS_EEPROM_ADDR_START; i < PASS_EEPROM_ADDR_END; ++i) {
//     EEPROM.write(i, 0);
//   }
//   EEPROM.commit();
// }
// ---------------------------------------
void readSettingsFromEeprom() {
  EEPROM.get(MODE_ADDR, mode);
  EEPROM.get(TEMP_IN_ADDR, tempIn);
  EEPROM.get(TEMP_OUT_ADDR, tempOut);
  EEPROM.get(TEMP_DELTA_ADDR, tempDelta);
}
void writeSettingsToEeprom() {
  EEPROM.put(MODE_ADDR, mode);
  EEPROM.put(TEMP_IN_ADDR, tempIn);
  EEPROM.put(TEMP_OUT_ADDR, tempOut);
  EEPROM.put(TEMP_DELTA_ADDR, tempDelta);
  EEPROM.commit();

  Serial.println("Settings were written to EEPROM");
};
// ---------------------------------------
void initEEPROM() {
  Serial.print("Init EEPROM of size: ");
  Serial.println(EEPROM_SIZE);
  EEPROM.begin(EEPROM_SIZE);
}