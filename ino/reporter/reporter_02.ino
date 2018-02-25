#include <Bridge.h>
#include <HttpClient.h>
int temt6000Pin = A0;// Analog pin for reading sensor data
int light_value; // Keeps the resings from sensor
String url= "https://YOUR_API_ENDPOINT_GOES_HERE!"; // Our APIGateway endpoint
String isThereCoffee = "undefined"; // this will be set to tru or false later on and send to server
int threshold = 10; // The new threshold value will be pulled from the server and set to this var
String response = ""; // This var stores the response from the endpoint
void setup() {
 pinMode(temt6000Pin, INPUT); //data pin for ambientlight sensor
 // Bridge takes about two seconds to start up
 // it can be helpful to use the on-board LED
 // as an indicator for when it has initialized
 pinMode(13, OUTPUT);
 digitalWrite(13, LOW);
 Bridge.begin();
 digitalWrite(13, HIGH);
}
void loop() {
 // Light intensity calculations:
 int light_value = analogRead(temt6000Pin);
 if (light_value > threshold) {
   digitalWrite(13, HIGH);
   isThereCoffee = "false";
 } else {
   digitalWrite(13,LOW);
   isThereCoffee = "true";
 }
 // Initialize the client library
 HttpClient client;
 // Make a HTTP request:
 client.noCheckSSL();
 client.get( url + isThereCoffee );
 // if there are incoming bytes available
 // from the server, read them and set the response value to the final String:
 response = "";
 while (client.available()) {
   char c = client.read();
   response += c;
 }
 threshold = response.toInt();
 delay(45000); // You can change the intervall to your preferences ( Lambda's cheap but watch your cost! )
 digitalWrite(13, !digitalRead(13)); // Just because an LED blinking loos cool! :P
 delay(99);
 digitalWrite(13, !digitalRead(13)); // Setting it back to it's previous status (blink)
}