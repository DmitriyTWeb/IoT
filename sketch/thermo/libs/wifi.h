#pragma once

#include <ESP8266WiFi.h>
#include "./settings.h"

String SSID;
String PASSWORD;

void startToWiFi() {
  writeSSID("FREEDOM");
  writePASS("E7MRZZHZ");

  SSID = readSSID();
  PASSWORD = readPASS();

  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
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