#include "ESPAsyncWebServer.h"
#include <ArduinoJson.h>
#include "./settings.h"
#include "./variables.h"
#include "./wifi.h"
#include "./app-logic.h"

bool IS_CORS_ALLOWED = false;
const byte TEST_LED_PIN = LED_BUILTIN;


String bufferString = "";

AsyncWebServer server(80);

void allowCORS() {
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Credentials", "true");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
};


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
bool handleFileRead(AsyncWebServerRequest *request) {
  String path = request->url();

  if (path.endsWith("/")) {
    if(wifiMode != "AP") {
      path += "index.html";
    } else {
      path += "settings.html";
    }

  }

  if (SPIFFS.exists(path)) {
    String contentType = getContentType(path);
    request->send(SPIFFS, path, contentType);
    return true;
  }
  return false;
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

void startHttp() {
  if (IS_CORS_ALLOWED) {
    allowCORS();
  }

  server.begin();
  Serial.println("HTTP server is started");
  setHttpRequestHandlers();
  Serial.println("HTTP request handlers are configured");
}
