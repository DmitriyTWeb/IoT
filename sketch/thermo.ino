#include <ESP8266WiFi.h>
#include "ESPAsyncWebServer.h"
#include <FS.h>
#include <ESP8266FtpServer.h>
#include <ArduinoJson.h>
#include "EEPROM.h"

// --------------------------------------------------------
// Глобальные константы и переменные
const byte TEST_LED_PIN = LED_BUILTIN;
uint8_t PUMP_PIN = 16;

String mode;
float tempIn;
float tempOut;
float tempDelta;

float currentTemp;
String sensorStatus;
bool pumpState;

byte MODE_ADDR = 0;
byte TEMP_IN_ADDR = 4;
byte TEMP_OUT_ADDR = 8;
byte TEMP_DELTA_ADDR = 12;

String bufferString = "";
unsigned long startMillis;
unsigned long currentMillis;
const unsigned long PERIOD = 500;
// --------------------------------------------------------

AsyncWebServer server(80);
FtpServer ftpSrv;

void setup() {
  setupSerial();
  setupInOut();
  setupFtpSrv();
  setupSPIFFS();
  setupHttp();
  setupToWiFi();

  setupEEPROM();
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
void setupHttp() {
  server.begin();
  Serial.println("HTTP server is started");
  setHttpRequestHandlers();
  Serial.println("HTTP request handlers are configured");
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
void setupEEPROM() {
  EEPROM.begin(512);
}
void loadSettings() {
  // При запуске системы читаем ранее сохраненные настройки
  readSettingsFromEeprom();
}

void setHttpRequestHandlers() {
  server.on("/toggle_test_led", [](AsyncWebServerRequest *request) {
    request->send(200, "text/plain", (String)toggleTestLED());
  });
  server.on("/get_device_state", [](AsyncWebServerRequest *request) {
    request->send(200, "application/json", getDeviceState());
  });
  server.on("/get_device_settings", [](AsyncWebServerRequest *request) {
    request->send(200, "application/json", getDeviceSettings());
  });

  server.on("/set_device_settings", HTTP_POST,
    [](AsyncWebServerRequest *request) { },
    NULL,
    setDeviceSettingsHandler
  );

  server.onNotFound([](AsyncWebServerRequest *request) {
    if (!handleFileRead(request)) {
      request->send(404, "text/plain", "Not Found");
    }
  });
}

// Функция переключения встроенного диода
// Для первичного тестирования связи с платой
String toggleTestLED() {
  byte state;
  if (digitalRead(TEST_LED_PIN))
    state = 0;
  else
    state = 1;
  digitalWrite(TEST_LED_PIN, state);
  return String(state);
}
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
String getDeviceState() {
  String state;
  DynamicJsonDocument doc(256);
  float currentTemp = getTempCelsius();
  doc["pumpState"] = digitalRead(PUMP_PIN);
  doc["currentTemp"] = currentTemp;
  doc["sensorStatus"] = getSensorStatus(currentTemp);

  if (serializeJson(doc, state) == 0) {
    Serial.println(F("Failed to serialize device state"));
  }

  return state;
}
String getDeviceSettings() {
  String settings;
  DynamicJsonDocument doc(256);

  doc["tempIn"] = tempIn;
  doc["tempOut"] = tempOut;
  doc["tempDelta"] = tempDelta;
  doc["mode"] = mode;

  if (serializeJson(doc, settings) == 0) {
    Serial.println(F("Failed to serialize settings"));
  }

  return settings;
}

void setDeviceSettingsHandler(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
  String bodyChunk = "";

  for(size_t i=0; i<len; i++) {
    bodyChunk += (char)(*(data+i));
  }

  bufferString += bodyChunk;
  if(index + len == total) {
    DynamicJsonDocument responseJson(128);
    String responseMessage;

    bool isSavingSucces = saveSettings(bufferString);
    if(isSavingSucces) {
      responseJson["succes"] = "true";
      responseJson["data"] = bufferString;
      responseJson["error"] = "";

      serializeJson(responseJson, responseMessage);
      request->send(200, "application/json", responseMessage);
    } else {
      responseJson["succes"] = "false";
      responseJson["error"] = "Save settings attemp failed";

      serializeJson(responseJson, responseMessage);
      request->send(200, "application/json", responseMessage);
    }
    bufferString = "";
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

void controlMainLogic() {
  updateDeviceState();
  setPumpPin(mode, sensorStatus, currentTemp);
}
void updateDeviceState() {
  currentTemp = getTempCelsius();
  sensorStatus = getSensorStatus(currentTemp);
  pumpState = digitalRead(PUMP_PIN);
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
      Serial.println("mode = OUT");
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

void setDigitalPin(uint8_t pin, uint8_t newState) {
  int currentState =  digitalRead(pin);
  if (currentState != newState) {
    digitalWrite(pin, newState);
  }
}

void readSettingsFromEeprom() {
  EEPROM.get(MODE_ADDR, mode);
  EEPROM.get(TEMP_IN_ADDR, tempIn);
  EEPROM.get(TEMP_OUT_ADDR, tempOut);
  EEPROM.get(TEMP_DELTA_ADDR, tempDelta);
}

bool saveSettings(String jsonString) {
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, jsonString);

  mode = doc["mode"].as<const char*>();
  tempIn = doc["tempIn"].as<float>();
  tempOut = doc["tempOut"].as<float>();
  tempDelta = doc["tempDelta"].as<float>();

  if (mode && tempIn && tempOut && tempDelta) {
    writeSettingsToEeprom();
    return true;
  }

  return false;
}
void writeSettingsToEeprom() {
  EEPROM.put(MODE_ADDR, mode);
  EEPROM.put(TEMP_IN_ADDR, tempIn);
  EEPROM.put(TEMP_OUT_ADDR, tempOut);
  EEPROM.put(TEMP_DELTA_ADDR, tempDelta);
  EEPROM.commit();

  Serial.println("Settings were written to EEPROM");
};
