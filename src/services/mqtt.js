const mqtt = require('mqtt')
const config = require('../config')
const Device = require('../models/device.model')

const AutoRunner = require('../utils/autoRun')

class MqttHandler {
  constructor() {
    this.mqttClient = null
    this.host = config.mqtt.host
    this.username = config.mqtt.username // mqtt credentials if these are needed to connect
    this.password = config.mqtt.password
  }

  connect () {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password })

    // Mqtt error callback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end()
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`)
    });

    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`)
    });
  }

  mqttListener () {
    // When a message arrives, console.log it
    this.mqttClient.on('message', async (topic, message) => {
      console.log("Subscriber on ", topic, "Channel: ", message.toString())
      await AutoRunner.mqtt(topic, message)
    });
  }

  async initSubscribe () {
    const rawSubscriberChannels = await Device.find().select('topic')
    const topics = rawSubscriberChannels.length
      ? rawSubscriberChannels.map(sub => sub.topic)
      : []
    console.log("All channels: ", topics)
    this.mqttClient.subscribe(topics)
  }

  subscribe (topic) {
    this.mqttClient.subscribe(topic, { qos: 2 })
    this.mqttClient.on('message', function (topic, message) {
      console.log("Subscriber on ", topic, "Channel: ", message.toString())
    });
  }

  unsubscribe (topic) {
    this.mqttClient.unsubscribe(topic)
  }

  publish (topic, message) {
    this.mqttClient.connected &&
      this.mqttClient.publish(
        topic,
        message,
        {
          retain: false,
          qos: 2,
        }
      )
    console.log("Publisher on ", topic, " Channel: ", message)
  }

  handleData () {

  }
}

module.exports = MqttHandler