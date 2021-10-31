#include <ESP8266WiFi.h> // либа для создания собственной точки доступа на базе ESP
// #include "WiFi.h"
#include <ESP8266WebServer.h>
#include <FS.h>
#include <ESP8266FtpServer.h>
#include <ArduinoJson.h>

// Назначаем встроенный диод выходом
const byte LED_PIN = LED_BUILTIN;

ESP8266WebServer HTTP(80);
FtpServer ftpSrv;

void setup() {
  setupInOut();
  setupSerial();
  setupSPIFFS();
  setupHttp();
  setupToWiFi();
}

void loop() {
    HTTP.handleClient();
    ftpSrv.handleFTP();
}
// ==========================================================
void setupInOut() {
  pinMode(LED_PIN, OUTPUT);
}
void setupSPIFFS() {
  SPIFFS.begin();
  if (!SPIFFS.begin())
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }
}
void setupSerial() {
  const int bitrate = 115200;
  Serial.begin(bitrate);
}
void setupHttp() {
  HTTP.begin();
  setHttpRequestHandlers();
}
void setupFtpSrv() {
  ftpSrv.begin("admin", "admin");
}
void setupToWiFi() {
  char *SSID = "FREEDOM";
  const char *PASSWORD = "E7MRZZHZ";

  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi..");
    Serial.println(WiFi.status());
  }
  Serial.println(WiFi.localIP());
  Serial.println("\n");
}

void setHttpRequestHandlers() {
  HTTP.on("/relay_switch", []()
    { HTTP.send(200, "text/plain", switchLed());
  });
  HTTP.on("/get_total_status", []() {
    HTTP.send(200, "application/json", getTotalStatus());
  });

  HTTP.onNotFound([]() {
    if (!handleFileRead(HTTP.uri()))
      HTTP.send(404, "text/plain", "Not Found");
  });
}
// ==========================================================
// Функция переключения встроенного диода
String switchLed() {
  byte state;
  if (digitalRead(LED_PIN))
    state = 0;
  else
    state = 1;
  digitalWrite(LED_PIN, state);
  return String(state);
}

String getTotalStatus() {
  String status;
  // Allocate a temporary JsonDocument
  DynamicJsonDocument doc(512);
  doc["energyLifetime"] = 21698620;
  doc["energyYearly"] = 1363005;

  // Serialize JSON to file
  if (serializeJson(doc, status) == 0) {
    Serial.println(F("Failed to write to file"));
  }

  return status;
}

// Функция работы с файловой системой
bool handleFileRead(String path){
  if(path.endsWith("/")) path += "index.html";
  String contentType = getContentType(path);
  if(SPIFFS.exists(path)){
    File file = SPIFFS.open(path, "r");
    size_t sent = HTTP.streamFile(file, contentType);
    file.close();
    return true;
  }
  return false;
}

String getContentType(String filename){
  if (filename.endsWith(".html")) return "text/html";
  else if (filename.endsWith(".css")) return "text/css";
  else if (filename.endsWith(".js")) return "application/javascript";
  else if (filename.endsWith(".png")) return "image/png";
  else if (filename.endsWith(".jpg")) return "image/jpeg";
  else if (filename.endsWith(".gif")) return "image/gif";
  else if (filename.endsWith(".ico")) return "image/x-icon";
  return "text/plain";
}
