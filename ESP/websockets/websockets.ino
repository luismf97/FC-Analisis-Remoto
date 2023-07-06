//importamos las librerias necestias
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>       //consulta en https://arduinojson.org/
#include <WebSocketsClient.h>  //importado y descargado de https://github.com/Links2004/arduinoWebSockets
#include <SocketIOclient.h>
//Declaramos las variables de conexión al WIFI
#define SSID "INFINITUM379C_2.4"
#define PASSWORD "Pelusa2018"
#define SERVER "ecg-server.herokuapp.com" 

SocketIOclient socketIO;
//Declaramos variables 
String mensaje = "mensajeInicial";
String telefono = "525567860817";
const int dataPorSerie = 100;
boolean registrado = false; 
unsigned long nextActionTime = 0;
int datosPorPaquete = 1;
int numeroPaquetes =1;
int frecuencia= 1000;

//construimos la función que estará escuchando los mensajes que vamos a recibir por sockets desde el backend
void messageHandler(uint8_t* payload) { 
  StaticJsonDocument<128> doc;
  DeserializationError error = deserializeJson(doc, payload);
  if (error) {
    return;
  }
  String messageKey = doc[0];
  String value = doc[1];
  //añadimos aqui el tipo de acciones que vamos a monitorizar con los sockets
  if (messageKey == "ecg") {
    mensaje = messageKey;
  }
  if (messageKey == "otros") {
    mensaje = messageKey;
  }
  if (messageKey == "detener") {
    nextActionTime = 0;
    mensaje = messageKey;
  }
 if (messageKey == "temp") {
    mensaje = messageKey;
  }
 if (messageKey == "userConf") {
    DynamicJsonDocument jsonDocument(128);
    deserializeJson(jsonDocument, value);
    const char* mensajevalue = jsonDocument["mensaje"];
    telefono = mensajevalue;
  }
   if (messageKey == "otroRegistroConf") {
    DynamicJsonDocument jsonDocumentC(128);
    deserializeJson(jsonDocumentC, value);
    const char* mensajevalue1 = jsonDocumentC["datosPorPaquete"];
    const char* mensajevalue2 = jsonDocumentC["numeroPaquetes"];
    const char* mensajevalue3 = jsonDocumentC["frecuencia"];
    datosPorPaquete = atoi(mensajevalue1);
    numeroPaquetes = atoi(mensajevalue2);
    frecuencia = atoi(mensajevalue3);
  }
}

//Construimos la función que nos conectara por socket a nuestro backend
void socketIOEvent(socketIOmessageType_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case sIOtype_DISCONNECT:
      registrado = false;
      break;
    case sIOtype_CONNECT:
      //Serial.printf("Connected to url: %s%s\n", SERVER, payload);
      socketIO.send(sIOtype_CONNECT, "/"); 
      delay(1000);
      if (registrado == false) { //Le decimos a nuestro server que NODEMCU esta conectado
        DynamicJsonDocument doc(128);
        JsonArray array = doc.to<JsonArray>();
        array.add("configurar-usuario");
        JsonObject param1 = array.createNestedObject();
        param1["nombre"] = "NODEMCU";
        String output;
        serializeJson(doc, output);
        socketIO.sendEVENT(output);
        //Serial.println("NODEMCU configurado...");
        registrado = true;
      } 
      break;
    case sIOtype_EVENT:
      messageHandler(payload);  //Escuchamos los eventos que vienen del servidor
      break;
  }
}


//Configuramos la conexión por WIFI
void setupWiFi() {
  //Serial.println("\nConnecting...");
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    //Serial.print(".");
    delay(500);
  }
  //Serial.println("\nConnected : ");
  //Serial.println(WiFi.localIP());
}

//Configuramos función para enviar notificaciones
void notificacion(int temperatura){
    DynamicJsonDocument doc(124);
    JsonArray array = doc.to<JsonArray>();
    array.add("notificacion");
    JsonObject param1 = array.createNestedObject();
    param1["mensaje"] = "Atención!!! El valor de la temperatura es: " + String(temperatura)+ "°C";
    param1["numero"] = telefono;
    String output;
    serializeJson(doc, output);
    socketIO.sendEVENT(output);
}

//Configuramos nuestro sistema para el modo temp

void temp(){
  int temperatura = ((analogRead(A0) * 330.0)/1023.0);
  DynamicJsonDocument doc(64);
  JsonArray array = doc.to<JsonArray>();
  array.add("event_temp");
  JsonObject param1 = array.createNestedObject();
  param1["now"] = temperatura;
  String output;
  serializeJson(doc, output);
  socketIO.sendEVENT(output);
  if (temperatura < 36){
     notificacion(temperatura);
  }
  if (temperatura > 38){
    notificacion(temperatura);
  }
}

//configuramos la función para cualquier tipo de registro
void otros() {
  DynamicJsonDocument docx(10240);
  JsonArray array = docx.to<JsonArray>();
  array.add("event_name");
  JsonObject param1 = docx.createNestedObject();  
  for (int index = 0; index < numeroPaquetes; index++) {
    String s;
    byte i = 0;
    for (byte i = 0; i < datosPorPaquete; i = i + 1) {   
        s= s + String(analogRead(A0)) + ",";
        delay(frecuencia);   
    }
    param1["now" + String(index)] = s;
  }
  String outputx;
  serializeJson(docx, outputx);
  socketIO.sendEVENT(outputx);
}

//declarmaos la función para registro de ecg
void ecg() {
  DynamicJsonDocument doc(10240);
  JsonArray array = doc.to<JsonArray>();
  array.add("event_name");
  JsonObject param1 = doc.createNestedObject();  
  for (int index = 0; index < 10; index++) {
    String s;
    byte i = 0;
    for (byte i = 0; i < 100; i = i + 1) { 
       s += String(analogRead(A0)) + ",";
       delay(1);
    }
    param1["now" + String(index)] = s;
  }
  String output;
  serializeJson(doc, output);
  socketIO.sendEVENT(output);
}

//Configuguramos nuestro sistema
void setup() {
  Serial.begin(9600); 
  pinMode(16, INPUT); // Setup for leads off detection LO +  
  pinMode(5, INPUT); // Setup for leads off detection LO   
  setupWiFi();
  socketIO.begin(SERVER, 80);
  socketIO.onEvent(socketIOEvent);
}

//Iniciamos nuestro loop inicial
void loop() {
  unsigned long now = millis();
  socketIO.loop();
  if (mensaje == "ecg"){
    ecg();
  }
  if (mensaje == "otros"){
    otros();
  }
  if (mensaje == "temp"){
    if (now >= nextActionTime) { // Si la hora actual es mayor o igual que la hora de la siguiente acción
    temp();             // Ejecuta la función
    nextActionTime = now + 30000; // Actualiza la hora de la siguiente acción // Retardo de 30 segundos
    }
  }
}
