#include <FS.h>
#include <ESP8266FtpServer.h>

// import own libs
#include "./libs/webserver.h"
#include "./libs/wifi.h"
#include "./libs/eepromlib.h"
#include "./libs/app-logic.h"

// --------------------------------------------------------
// Глобальные константы и переменные
unsigned long startMillis;
unsigned long currentMillis;
const unsigned long PERIOD = 500;
// --------------------------------------------------------
FtpServer ftpSrv;

void setup() {
  setupSerial();
  initEEPROM();

  setupInOut();
  setupFtpSrv();
  setupSPIFFS();
  setupHttp();
  setupToWiFi();
  loadSettings();

  startMillis = millis();
}

void loop() {
  ftpSrv.handleFTP();
  currentMillis = millis();
  if (currentMillis - startMillis >= PERIOD) {
    controlMainLogic();
    startMillis = currentMillis;
  }

}
// ========================================================
void setupInOut() {
  pinMode(TEST_LED_PIN, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);
  Serial.println("Inputs and Outputs are configured");
}
void setupSPIFFS() {
  SPIFFS.begin();
  if (!SPIFFS.begin())
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }
  Serial.println("SPIFFS is started");
}
void setupSerial() {
  const int bitrate = 115200;
  Serial.begin(bitrate);

  Serial.print("Serial port is open with ");
  Serial.print(bitrate);
  Serial.println(" bps");
}

void setupFtpSrv() {
  ftpSrv.begin("admin", "admin");
  Serial.println("FTP server is started");
}
