const mqtt = require('mqtt')
const config = require('../config')
const DevicesTypes = require('../constants/deviceTypes')
const AutoRunner = require('../utils/autoRun')

const Device = require('../models/device.model')
const Room = require('../models/room.model')

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

      // const device = await AutoRunner.mqtt(topic, message)

      const device = await Device
        .findOneAndUpdate(
          { topic: topic },
          {
            $push: {
              data: {
                value: parseFloat(message),
                createdAt: new Date()
              }
            }
          },
          { new: true }
        )

      if (device?.type === DevicesTypes.LIGHT) {
        if (parseFloat(message) > 10 &&
          parseFloat(message) <= 100) return

        const getAllLamps = await Device
          .find({
            roomId: device.roomId,
            type: DevicesTypes.IO,
          })
          .sort({ createdAt: 'desc' })

        if (!getAllLamps && !getAllLamps.length) return

        const lampTopics = getAllLamps.map(l => l?.topic.toString())

        if (parseFloat(message) > 100) {
          if (device?.isLive) {
            this.publish(lampTopics[0], '0')
            await Device.findByIdAndUpdate(
              device.id,
              { isLive: false }
            )
          }
        }

        if (parseFloat(message) <= 10) {
          if (!device?.isLive) {
            this.publish(lampTopics[0], '1')
            await Device.findByIdAndUpdate(
              device.id,
              { isLive: true }
            )
          }
        }

      }

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
          qos: 0,
        }
      )
    console.log("Publisher on ", topic, " Channel: ", message)
  }

  handleData () {

  }
}

module.exports = MqttHandler