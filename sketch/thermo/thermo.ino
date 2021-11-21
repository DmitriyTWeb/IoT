#include <FS.h>
#include <ESP8266FtpServer.h>

// import own libs
#include "./libs/webserver.h"
#include "./libs/wifi.h"
#include "./libs/eepromlib.h"
#include "./libs/app-logic.h"
#include "./libs/fslib.h"

// --------------------------------------------------------
// Глобальные константы и переменные
unsigned long startMillis;
unsigned long currentMillis;
const unsigned long PERIOD = 5000;
// --------------------------------------------------------
FtpServer ftpSrv;

void setup() {
  setupSerial();
  initEEPROM();

  setupFtpSrv();
  mountFS();

  setupInOut();

  startHttp();
  startWiFi();
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

void setupSerial() {
  const int BITRATE = 115200;
  Serial.begin(BITRATE);

  Serial.print("Serial port is open with ");
  Serial.print(BITRATE);
  Serial.println(" bps");
}

void setupFtpSrv() {
  ftpSrv.begin("admin", "admin");
  Serial.println("FTP server is started");
}
