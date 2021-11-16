#pragma once

#include "EEPROM.h"
#include "./variables.h"

const int EEPROM_SIZE = 512;
const int EEPROM_MIN_ADDR = 0;
const int EEPROM_MAX_ADDR = 511;

boolean eeprom_is_addr_ok(int addr) {
  return ((addr >= EEPROM_MIN_ADDR) && (addr <= EEPROM_MAX_ADDR));
}
boolean eeprom_write_bytes(int startAddr, const byte* array, int numBytes) {
  int i;

  // both first byte and last byte addresses must fall within
  // the allowed range
  if (!eeprom_is_addr_ok(startAddr) || !eeprom_is_addr_ok(startAddr + numBytes)) {
    return false;
  }
  for (i = 0; i < numBytes; i++) {
    EEPROM.write(startAddr + i, array[i]);
  }
  return true;
}
// ========================================================
// export part
// --------------------------------------------------------
boolean eepromWriteString(int addr, const char* string) {
  int numBytes;
  numBytes = strlen(string) + 1;
  return eeprom_write_bytes(addr, (const byte*)string, numBytes);
}
boolean eepromReadString(int addr, char* buffer, int bufSize) {
  byte ch;
  int bytesRead;

  if (!eeprom_is_addr_ok(addr)) {
    return false;
  }
  if (bufSize == 0) {
    return false;
  }
  if (bufSize == 1) {
    buffer[0] = 0;
    return true;
  }

  bytesRead = 0;
  ch = EEPROM.read(addr + bytesRead);
  buffer[bytesRead] = ch;
  bytesRead++;

  while ( (ch != 0x00) && (bytesRead < bufSize) && ((addr + bytesRead) <= EEPROM_MAX_ADDR) ) {
    ch = EEPROM.read(addr + bytesRead);
    buffer[bytesRead] = ch;
    bytesRead++;
  }

  if ((ch != 0x00) && (bytesRead >= 1)) {
    buffer[bytesRead - 1] = 0;
  }

  return true;
}
// ---------------------------------------
void initEEPROM() {
  Serial.print("Init EEPROM of size: ");
  Serial.println(EEPROM_SIZE);
  EEPROM.begin(EEPROM_SIZE);
}
