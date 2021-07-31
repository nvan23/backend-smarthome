const mqtt = require('mqtt')
const config = require('../config')
const DevicesTypes = require('../constants/deviceTypes')
const Time = require('../utils/time')
const Mailer = require('../utils/mail')

const Device = require('../models/device.model')

const gasWarning = require('../utils/templates/gasWarning')
const temperatureWarning = require('../utils/templates/temperatureWarning')

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
    this.mqttClient.on('message', async function (topic, message) {
      console.log("Subscriber on ", topic, "Channel: ", message.toString())
      const device = await Device
        .findOneAndUpdate(
          { topic: topic },
          { $push: { data: parseInt(message) } },
          { new: true }
        )

      if (device) {
        switch (device?.type) {
          case DevicesTypes.GAS:
            if (parseInt(message) > 300) {
              if (Time.lt10Minutes(device?.latestGasWarnedAt?.toString()))
                break

              const emails = await Mailer.All()
              console.log('emails', emails)
              if (emails?.length) {
                for (let email of emails) {
                  Mailer.sendMail(
                    '[Gas Warning] High gas concentration',
                    email,
                    gasWarning.gasWarning(message)
                  )
                }
                device.latestGasWarnedAt = new Date()
                await device.save()
              }

            }

            break

          case DevicesTypes.TEMPERATURE:
            if (parseInt(message) > 300) {
              if (Time.lt10Minutes(device?.latestTemperatureWarnedAt?.toString()))
                break

              const emails = await Mailer.All()
              if (emails.length) {
                for (let email of emails) {
                  Mailer.sendMail(
                    '[Temperature Warning] The temperature index is rising',
                    email,
                    temperatureWarning.temperatureWarning(message)
                  )
                }
                device.latestTemperatureWarnedAt = new Date()
                await device.save()
              }

            }

            break

          case DevicesTypes.AIR:

            break

          default:

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
    this.mqttClient.subscribe(topic)
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
          qos: 1,
        }
      )
    console.log("Publisher on ", topic, " Channel: ", message)
  }

  handleData () {

  }
}

module.exports = MqttHandler