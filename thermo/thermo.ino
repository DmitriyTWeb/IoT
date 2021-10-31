#include <ESP8266WiFi.h> // либа для создания собственной точки доступа на базе ESP
// #include "WiFi.h"
#include <ESP8266WebServer.h>
#include <FS.h>
#include <ESP8266FtpServer.h>
#include <ArduinoJson.h>

// Назначаем встроенный диод выходом
const byte LED_PIN = LED_BUILTIN;

char* SSID = "FREEDOM";
const char* PASSWORD = "E7MRZZHZ";

ESP8266WebServer HTTP(80);
FtpServer ftpSrv;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);

  SPIFFS.begin();
  if (!SPIFFS.begin()) {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }
  HTTP.begin();
  ftpSrv.begin("admin","admin");

  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
    Serial.println(WiFi.status());
  }
  Serial.println(WiFi.localIP());
  Serial.println("\n");

  // Обработка HTTP-запросов
  HTTP.on("/relay_switch", [](){                                        // При HTTP запросе вида http://192.168.4.1/relay_switch
      HTTP.send(200, "text/plain", relay_switch());                     // Отдаём клиенту код успешной обработки запроса, сообщаем, что формат ответа текстовый и возвращаем результат выполнения функции
  });
  HTTP.on("/get_total_status", []() {
    HTTP.send(200, "application/json", getTotalStatus());
  });

  HTTP.on("/relay_status", [](){                                        // При HTTP запросе вида http://192.168.4.1/relay_status
      HTTP.send(200, "text/plain", relay_status());                     // Отдаём клиенту код успешной обработки запроса, сообщаем, что формат ответа текстовый и возвращаем результат выполнения функции relay_status
  });
  HTTP.onNotFound([](){                                                 // Описываем действия при событии "Не найдено"
  if(!handleFileRead(HTTP.uri()))                                       // Если функция handleFileRead (описана ниже) возвращает значение false в ответ на поиск файла в файловой системе
      HTTP.send(404, "text/plain", "Not Found");                        // возвращаем на запрос текстовое сообщение "File isn't found" с кодом 404 (не найдено)
  });
}

void loop() {
    HTTP.handleClient();                                                // Обработчик HTTP-событий (отлавливает HTTP-запросы к устройству и обрабатывает их в соответствии с выше описанным алгоритмом)
    ftpSrv.handleFTP();                                                 // Обработчик FTP-соединений
}

String relay_switch() {                                                 // Функция переключения реле
  byte state;
  if (digitalRead(LED_PIN))                                                // Если на пине реле высокий уровень
    state = 0;                                                          //  то запоминаем, что его надо поменять на низкий
  else                                                                  // иначе
    state = 1;                                                          //  запоминаем, что надо поменять на высокий
  digitalWrite(LED_PIN, state);                                         // меняем значение на пине подключения реле
  return String(state);                                                 // возвращаем результат, преобразовав число в строку
}

String relay_status() {                                                 // Функция для определения текущего статуса реле
  byte state;
  if (digitalRead(LED_PIN))                                             // Если на пине реле высокий уровень
    state = 1;                                                          //  то запоминаем его как единицу
  else                                                                  // иначе
    state = 0;                                                          //  запоминаем его как ноль
  return String(state);                                                 // возвращаем результат, преобразовав число в строку
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

bool handleFileRead(String path){                                       // Функция работы с файловой системой
  if(path.endsWith("/")) path += "index.html";                          // Если устройство вызывается по корневому адресу, то должен вызываться файл index.html (добавляем его в конец адреса)
  String contentType = getContentType(path);                            // С помощью функции getContentType (описана ниже) определяем по типу файла (в адресе обращения) какой заголовок необходимо возвращать по его вызову
  if(SPIFFS.exists(path)){                                              // Если в файловой системе существует файл по адресу обращения
    File file = SPIFFS.open(path, "r");                                 //  Открываем файл для чтения
    size_t sent = HTTP.streamFile(file, contentType);                   //  Выводим содержимое файла по HTTP, указывая заголовок типа содержимого contentType
    file.close();                                                       //  Закрываем файл
    return true;                                                        //  Завершаем выполнение функции, возвращая результатом ее исполнения true (истина)
  }
  return false;                                                         // Завершаем выполнение функции, возвращая результатом ее исполнения false (если не обработалось предыдущее условие)
}

String getContentType(String filename){                                 // Функция, возвращающая необходимый заголовок типа содержимого в зависимости от расширения файла
  if (filename.endsWith(".html")) return "text/html";                   // Если файл заканчивается на ".html", то возвращаем заголовок "text/html" и завершаем выполнение функции
  else if (filename.endsWith(".css")) return "text/css";                // Если файл заканчивается на ".css", то возвращаем заголовок "text/css" и завершаем выполнение функции
  else if (filename.endsWith(".js")) return "application/javascript";   // Если файл заканчивается на ".js", то возвращаем заголовок "application/javascript" и завершаем выполнение функции
  else if (filename.endsWith(".png")) return "image/png";               // Если файл заканчивается на ".png", то возвращаем заголовок "image/png" и завершаем выполнение функции
  else if (filename.endsWith(".jpg")) return "image/jpeg";              // Если файл заканчивается на ".jpg", то возвращаем заголовок "image/jpg" и завершаем выполнение функции
  else if (filename.endsWith(".gif")) return "image/gif";               // Если файл заканчивается на ".gif", то возвращаем заголовок "image/gif" и завершаем выполнение функции
  else if (filename.endsWith(".ico")) return "image/x-icon";            // Если файл заканчивается на ".ico", то возвращаем заголовок "image/x-icon" и завершаем выполнение функции
  return "text/plain";                                                  // Если ни один из типов файла не совпал, то считаем что содержимое файла текстовое, отдаем соответствующий заголовок и завершаем выполнение функции
}
