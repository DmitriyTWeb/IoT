#pragma once

#include <FS.h>

// ========================================================
// export part
// --------------------------------------------------------
bool mountFS() {
  bool success = SPIFFS.begin();

  if (success) {
    Serial.println("File system mounted with success");
  } else {
    Serial.println("Error mounting the file system");
  }

  return success;
}

bool writeToFile(String fileName, String txt) {
  File file = SPIFFS.open("/"+fileName, "w");

  bool isWritten = false;
  if (!file) {
    Serial.println("Error opening file for writing");
    return isWritten;
  }

  int bytesWritten = file.print(txt);

  if (bytesWritten > 0) {
    Serial.print ("File was written. Bytes writted: ");
    Serial.println(bytesWritten);
    isWritten = true;
  } else {
    Serial.print("Writing string ");
    Serial.print(txt);
    Serial.print(" to file failed");
    Serial.println("File write failed");
  }

  file.close();

  return isWritten;
}
