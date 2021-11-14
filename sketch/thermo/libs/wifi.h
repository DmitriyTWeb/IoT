#pragma once

#include <ESP8266WiFi.h>

char *SSID = "FREEDOM";
const char *PASSWORD = "E7MRZZHZ";

void setupToWiFi() {
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