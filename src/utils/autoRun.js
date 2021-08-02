const DevicesTypes = require('../constants/deviceTypes')
const Array = require('../utils/array')
const Time = require('../utils/time')
const Mailer = require('../utils/mail')

const Device = require('../models/device.model')
const Room = require('../models/room.model')

const gasWarning = require('../utils/templates/gasWarning')
const temperatureWarning = require('../utils/templates/temperatureWarning')

exports.mqtt = async (topic, message) => {

  const device = await Device
    .findOneAndUpdate(
      { topic: topic },
      { $push: { data: parseInt(message) } },
      { new: true }
    )

  if (!device && !device?.type) return

  switch (device?.type) {
    case DevicesTypes.GAS:
      if (parseInt(message) > 300) {
        if (device?.latestGasWarnedAt?.length &&
          Time.lt10Minutes(Array.last(device?.latestGasWarnedAt).toString()))
          break

        const emails = await Mailer.All()
        if (emails?.length) {
          for (let email of emails) {
            Mailer.sendMail(
              '[Gas Warning] High gas concentration',
              email,
              gasWarning.gasWarning(message)
            )
          }
          device.latestGasWarnedAt.push((new Date()).toString())
          await device.save()
        }

      }

      break

    case DevicesTypes.TEMPERATURE:
      if (parseInt(message) > 100) {
        if (device?.latestTemperatureWarnedAt?.length &&
          Time.lt10Minutes(Array.last(device?.latestTemperatureWarnedAt).toString()))
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
          device.latestTemperatureWarnedAt.push((new Date()).toString())
          await device.save()
        }

      }

      break

    default:
      break
  }

  return device

}
