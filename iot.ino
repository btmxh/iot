#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <HTTPClient.h> 
#include "time.h"

#define SERVER "ep44.local"

const char* ssid = "mangtrau";
const char* password = "12345678";
const char* mqtt_server = SERVER; 
const int mqtt_port = 1883;
const char* ntfy_topic = "esp32-alerts"; 

#define DHTPIN 4       
#define DHTTYPE DHT22
#define LED_PIN 2

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;

  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("MQTT message on ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(message);

  if (String(topic) == "iot/led") {
    if (message == "ON") {
      digitalWrite(LED_PIN, HIGH);
      Serial.println("LED turned ON via MQTT");
    } 
    else if (message == "OFF") {
      digitalWrite(LED_PIN, LOW);
      Serial.println("LED turned OFF via MQTT");
    }
  }
}

String getTime() {
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)) return "00:00:00";
  char timeStringBuff[50];
  strftime(timeStringBuff, sizeof(timeStringBuff), "%H:%M:%S", &timeinfo);
  return String(timeStringBuff);
}

void sendNtfy(float t, float h, String timeStr) {
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    String url = "http://" SERVER ":6767/" + String(ntfy_topic);
    http.begin(url);
    
    String message = "Notification! \nTemperature: " + String(t) + "C \nHumidity: " + String(h);
    
    http.addHeader("Title", "ESP32 Sensor Update");
    http.addHeader("Priority", "5"); 
    
    int httpResponseCode = http.POST(message);
    if (httpResponseCode > 0) Serial.println("Notification sent via ntfy!");
    http.end();
  }
}

void setup_wifi() {
  Serial.println(ssid);
  Serial.println(password);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nWiFi Connected!");
  configTime(25200, 0, SERVER); 
}

void reconnect() {
  Serial.println("Attempting MQTT connection...");
  while (!client.connected()) {
    String clientId = "ESP32-" + String(WiFi.macAddress());
    if (client.connect(clientId.c_str())) {
      Serial.println("MQTT Connected!");
      client.subscribe("iot/led");
    }
    else delay(5000);
  }
}

void setup() {
  Serial.begin(115200);
  delay(2000);
  pinMode(LED_PIN, OUTPUT);

  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqttCallback);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  static unsigned long lastMsg = 0;
  static unsigned long lastNotify = 0;
  unsigned long now = millis();

  if (now - lastMsg > 3000) {
    lastMsg = now;
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    String currentTime = getTime();

    if (isnan(h) || isnan(t)) return;

    JsonDocument doc; 
    doc["temp"] = t; 
    doc["hum"] = h;

    char buffer[256];
    serializeJson(doc, buffer);
    client.publish("iot/data", buffer);

    if (now - lastNotify > 100000) {
       sendNtfy(t, h, currentTime);
       lastNotify = now;
    }
  }
}
