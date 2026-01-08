const broker = '127.0.0.1';
const port = 9001; 
const topicData = 'iot/data';
const topicCommand = 'iot/command';
const username = '';
const password = '';
const client_id = 'web-pub-' + parseInt(Math.random() * 1000, 10);

const client = new Paho.MQTT.Client(broker, port, client_id);

function onConnect() {
  console.log('Pub: Connected to MQTT broker Local');
}

function onFailure(err) {
  console.error('Pub: Failed to connect to MQTT broker:', err);
}

function onMessageDelivered() {
  console.log('Pub: Message delivered');
}

client.onConnectionLost = onFailure;
client.onMessageDelivered = onMessageDelivered;

client.connect({
  onSuccess: onConnect,
  onFailure: onFailure,
  userName: username,
  password: password,
  useSSL: false 
});

function publishMessage(message) {
  if (client.isConnected()) {
    message = new Paho.MQTT.Message(message);
    message.destinationName = topicCommand;
    client.send(message);
    console.log("Pub: Sent message", message);
  } else {
    console.log("Pub: Client not connected");
  }
}