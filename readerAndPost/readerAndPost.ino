#include <ESP8266WiFi.h>
#include <WiFiClient.h> 
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN         5          // Configurable, see typical pin layout above
#define SS_PIN          4         // Configurable, see typical pin layout above
#define BUZZER D8

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance

/* Set these to your desired credentials. */
const char *ssid = "Note 5";  //ENTER YOUR WIFI SETTINGS
const char *password = "test@123";

//Web/Server address to read/write from 
const char *host = "192.168.43.34:8000"; 

String content="";

void setup() {
  delay(1000);
//  For wifi
  pinMode(BUZZER, OUTPUT);
  Serial.begin(115200);   // Initialize serial communications with the PC
  WiFi.mode(WIFI_OFF);        //Prevents reconnection issue (taking too long to connect)
  delay(1000);
  WiFi.mode(WIFI_STA);        //This line hides the viewing of ESP as wifi hotspot
  
  WiFi.begin(ssid, password);     //Connect to your WiFi router
  Serial.println("");

  Serial.print("Connecting");
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  digitalWrite(BUZZER, HIGH);
  delay(100);
  digitalWrite(BUZZER, LOW);

  //If connection successful show IP address in serial monitor
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());  //IP address assigned to your ESP

  

//  For reader
  while (!Serial);    // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)
  SPI.begin();      // Init SPI bus
  mfrc522.PCD_Init();   // Init MFRC522
  mfrc522.PCD_DumpVersionToSerial();  // Show details of PCD - MFRC522 Card Reader details
  Serial.println(F("Scan PICC to see UID, SAK, type, and data blocks..."));
}

void loop() {
  // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Dump debug info about the card; PICC_HaltA() is automatically called
  // mfrc522.PICC_DumpToSerial(&(mfrc522.uid.uidByte));
  HTTPClient http;    //Declare object of class HTTPClient

  printHex(mfrc522.uid.uidByte, mfrc522.uid.size);
  digitalWrite(BUZZER, HIGH);
  delay(100);
  digitalWrite(BUZZER, LOW);
  Serial.println();
  
  String postData = "rfid="+content+"&sno=1";
  http.begin("http://192.168.43.34:8000/data");              //Specify request destination
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");    //Specify content-type header

  int httpCode = http.POST(postData);   //Send the request
  String payload = http.getString();    //Get the response payload

//  Serial.println(httpCode);   //Print HTTP return code
//  Serial.println(payload);    //Print request response payload

  http.end();  //Close connection
  
//  delay(100);  //Post Data at every 5 seconds
}

void printHex(byte *buffer, byte bufferSize) {
  content="";
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
    content.concat(String(buffer[i] < 0x10 ? " 0" : " "));
    content.concat(String(buffer[i], HEX));
  }
}
