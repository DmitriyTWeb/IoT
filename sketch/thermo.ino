#include <ESP8266WiFi.h> // либа для создания собственной точки доступа на базе ESP
// #include "WiFi.h"
#include <ESP8266WebServer.h>
#include <FS.h>
#include <ESP8266FtpServer.h>
#include <ArduinoJson.h>
#include "EEPROM.h"

// Назначаем встроенный диод выходом
const byte TEST_LED_PIN = LED_BUILTIN;
uint8_t PUMP_PIN = 16;

ESP8266WebServer HTTP(80);
FtpServer ftpSrv;

void setup() {
  setupInOut();
  setupSerial();
  setupFtpSrv();
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
  pinMode(TEST_LED_PIN, OUTPUT);
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
    HTTP.send(200, "application/json", getTotalStatusHandler());
  });
  HTTP.on("/set_total_status", setTotalStatusHandler);

  HTTP.onNotFound([]() {
    if (!handleFileRead(HTTP.uri()))
      HTTP.send(404, "text/plain", "Not Found");
  });
}
// Функция работы с файловой системой
bool handleFileRead(String path)
{
  if (path.endsWith("/")) {
    path += "index.html";
  }
  String contentType = getContentType(path);
  if (SPIFFS.exists(path)) {
    File file = SPIFFS.open(path, "r");
    size_t sent = HTTP.streamFile(file, contentType);
    file.close();
    return true;
  }

  return false;
}

String getContentType(String filename)
{
  if (filename.endsWith(".html"))
    return "text/html";
  else if (filename.endsWith(".css"))
    return "text/css";
  else if (filename.endsWith(".js"))
    return "application/javascript";
  else if (filename.endsWith(".png"))
    return "image/png";
  else if (filename.endsWith(".jpg"))
    return "image/jpeg";
  else if (filename.endsWith(".gif"))
    return "image/gif";
  else if (filename.endsWith(".ico"))
    return "image/x-icon";

  return "text/plain";
}

// ==========================================================
char *mode;
float threshInBath;
float threshOutOfBath;
float tempDelta;

void setParamsToEeprom() {
  // EEPROM.put(0, inputMessage_0);
  // EEPROM.put(4, inputMessage_1);
  // EEPROM.put(8, inputMessage_2);
  // EEPROM.put(12, inputMessage_3);
  // EEPROM.commit();
};

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
String getSensorState(float temp) {
  String state;

  if (temp < -55 || temp > 125) {
    state = "SENSOR_BROKEN";
    // OM_0 = "red";
  } else {
    state = "SENSOR_WORK";
    // OM_0 = "blue";
  }
}

void setPumpPin(String mode, String sensorState, float temp) {
  if (mode == "Yes" && sensorState == "SENSOR_WORK") {
    if (temp < (threshInBath - tempDelta)) {
      Serial.print("PumpPin = HIGH");
      digitalWrite(PUMP_PIN, HIGH);
    } else if (temp > (threshInBath + tempDelta)) {
      digitalWrite(PUMP_PIN, LOW);
    }
  } else if (mode == "No" && sensorState == "SENSOR_WORK") {
    if (temp < threshOutOfBath - tempDelta) {
      digitalWrite(PUMP_PIN, HIGH);
    } else if (temp > (threshOutOfBath + tempDelta)) {
      digitalWrite(PUMP_PIN, LOW);
    }
  } else {
    digitalWrite(PUMP_PIN, LOW);
  }
}
// Функция переключения встроенного диода
String switchLed() {
  byte state;
  if (digitalRead(TEST_LED_PIN))
    state = 0;
  else
    state = 1;
  digitalWrite(TEST_LED_PIN, state);
  return String(state);
}
String getTotalStatusHandler() {
  String status;
  // Allocate a temporary JsonDocument
  DynamicJsonDocument doc(512);
  doc["pupmState"] = digitalRead(PUMP_PIN);
  doc["currentTemp"] = getTempCelsius();
  doc["threshInBath"] = threshInBath;
  doc["threshOutOfBath"] = threshOutOfBath;
  doc["tempDelta"] = tempDelta;

  // Serialize JSON to file
  if (serializeJson(doc, status) == 0) {
    Serial.println(F("Failed to write to file"));
  }

  return status;
}

void setTotalStatusHandler() {
  if (HTTP.hasArg("plain")== false) {
    HTTP.send(200, "text/plain", "Body not received");
    return;
  }
  String requestBody = HTTP.arg("plain");

  DynamicJsonDocument doc(1024);
  deserializeJson(doc, requestBody);


  threshOutOfBath = doc["threshOutOfBath"];
  threshInBath = doc["threshInBath"];
  tempDelta = doc["tempDelta"];

  String message = "Body received:\n";
  message += HTTP.arg("plain");
  message += "\n";

  // Serial.println(F("threshOutOfBath = "));
  // Serial.println(threshOutOfBath);
  // Serial.println("\n");


  HTTP.send(200, "text/plain", HTTP.arg("plain"));
  Serial.println(message);
}
