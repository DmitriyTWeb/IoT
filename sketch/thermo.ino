#include <ESP8266WiFi.h>
#include "ESPAsyncWebServer.h"
#include <FS.h>
#include <ESP8266FtpServer.h>
#include <ArduinoJson.h>
#include "EEPROM.h"

// Назначаем встроенный диод выходом
const byte TEST_LED_PIN = LED_BUILTIN;
uint8_t PUMP_PIN = 16;
String bufferString = "";

AsyncWebServer server(80);
FtpServer ftpSrv;

void setup() {
  setupSerial();
  setupInOut();
  setupFtpSrv();
  setupSPIFFS();
  setupHttp();
  setupToWiFi();
}

void loop() {
  ftpSrv.handleFTP();
}
// ========================================================
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
  // open the serial port at 115200 bps:
  const int bitrate = 115200;
  Serial.begin(bitrate);

  Serial.print("Serial port is open with ");
  Serial.print(bitrate);
  Serial.println(" bps");
}
void setupHttp() {
  server.begin();
  Serial.println("HTTP server is started");
  setHttpRequestHandlers();
}
void setupFtpSrv() {
  ftpSrv.begin("admin", "admin");
  Serial.println("FTP server is started");
}
void setupToWiFi() {
  char *SSID = "FREEDOM";
  const char *PASSWORD = "E7MRZZHZ";

  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi..");
    Serial.print("WiFi status code: ");
    Serial.println(WiFi.status());
  }
  Serial.print("NodeMCU is connected to access point \"");
  Serial.print(SSID);
  Serial.println("\"");
  Serial.print("WiFi localIP: ");
  Serial.println(WiFi.localIP());
}

void setHttpRequestHandlers() {
  server.on("/relay_switch", [](AsyncWebServerRequest *request) {
    request->send(200, "text/html", switchTestLED());
  });
  server.on("/get_total_status", [](AsyncWebServerRequest *request) {
    request->send(200, "application/json", getTotalStatusHandler());
  });

  server.on("/set_settings", HTTP_POST,
    [](AsyncWebServerRequest *request) { },
    NULL,
    [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
      String bodyChunk = "";

      for(size_t i=0; i<len; i++) {
        Serial.print('currentIndex = ');
        bodyChunk += (char)(*(data+i));
      }

      bufferString += bodyChunk;
      if(index + len == total) {
        request->send(200, "application/json", bufferString);
        bufferString = "";
      }

      // DynamicJsonDocument doc(1024);
      // deserializeJson(doc, requestBody);

      // mode = doc["mode"];
      // tempIn = doc["tempIn"];
      // tempOut = doc["tempOut"];
      // tempDelta = doc["tempDelta"];
    }
  );

  server.onNotFound([](AsyncWebServerRequest *request) {
    if (!handleFileRead(request)) {
      request->send(404, "text/plain", "Not Found");
    }
  });
  Serial.println("HTTP request handlers are configured");
}
// Функция работы с файловой системой
bool handleFileRead(AsyncWebServerRequest *request) {
  String path = request->url();

  if (path.endsWith("/"))
    path += "index.html";

  if (SPIFFS.exists(path)) {
    String contentType = getContentType(path);
    request->send(SPIFFS, path, contentType);
    return true;
  }
  return false;
}
String getContentType(String filename) {
  if (filename.endsWith(".html"))
    return "text/html";
  else if (filename.endsWith(".css"))
    return "text/css";
  else if (filename.endsWith(".js"))
    return "text/javascript";
  else if (filename.endsWith(".png"))
    return "image/png";
  else if (filename.endsWith(".jpg"))
    return "image/jpeg";
  else if (filename.endsWith(".gif"))
    return "image/gif";
  else if (filename.endsWith(".ico"))
    return "image/x-icon";
  else if (filename.endsWith(".svg"))
    return "image/svg+xml";

  return "text/plain";
}
// ========================================================

// --------------------------------------------------------
// Прикладная логика проекта
char *mode;
float tempIn;
float tempOut;
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
    if (temp < (tempIn - tempDelta)) {
      Serial.print("PumpPin = HIGH");
      digitalWrite(PUMP_PIN, HIGH);
    } else if (temp > (tempIn + tempDelta)) {
      digitalWrite(PUMP_PIN, LOW);
    }
  } else if (mode == "No" && sensorState == "SENSOR_WORK") {
    if (temp < tempOut - tempDelta) {
      digitalWrite(PUMP_PIN, HIGH);
    } else if (temp > (tempOut + tempDelta)) {
      digitalWrite(PUMP_PIN, LOW);
    }
  } else {
    digitalWrite(PUMP_PIN, LOW);
  }
}
// Функция переключения встроенного диода
String switchTestLED() {
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
  doc["tempIn"] = tempIn;
  doc["tempOut"] = tempOut;
  doc["tempDelta"] = tempDelta;
  doc["mode"] = mode;

  // Serialize JSON to file
  if (serializeJson(doc, status) == 0) {
    Serial.println(F("Failed to write to file"));
  }

  return status;
}

// void setSettingsHandler (AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
//   String requestBody;
//   if(!index) {
//     Serial.printf("BodyStart: %u B\n", total);
//   }
//   for(size_t i=0; i<len; i++) {
//     requestBody += data[i];
//     Serial.write(data[i]);
//   }
//   if(index + len == total){
//     Serial.printf("BodyEnd: %u B\n", total);
//   }

//   DynamicJsonDocument doc(1024);
//   deserializeJson(doc, requestBody);


//   mode = doc["mode"];
//   tempIn = doc["tempIn"];
//   tempOut = doc["tempOut"];
//   tempDelta = doc["tempDelta"];

//   // String message = "Body received:\n";
//   // message += HTTP.arg("plain");
//   // message += "\n";

//   // Serial.println(F("threshOutOfBath = "));
//   // Serial.println(threshOutOfBath);
//   // Serial.println("\n");


//   // .send(200, "text/plain", HTTP.arg("plain"));
//   Serial.println(requestBody);
// }