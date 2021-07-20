'use strict'

const Room = require("../../../../models/room.model")
const Device = require("../../../../models/device.model")

const checker = require('../../../../utils/checker')

const mqttHandler = require('../../../../services/mqtt')
const mqttClient = new mqttHandler()
mqttClient.connect()

exports.getAllDevices = async (req, res) => {
  try {
    Room
      .findById(req.room.id)
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'devices',
      })
      .select('devices')
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.getDevice = async (req, res) => {
  try {
    if (!checker.isObjectId(req?.params?.id))
      throw { error: "Invalid input" }

    Device
      .findById(req?.params?.id)
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.turnOn = (status) => {
  return async function (req, res) {
    try {
      if (!checker.isObjectId(req?.params?.id))
        throw { error: "Invalid input" }

      const device = await Device.findById(req?.params?.id)
      if (!device) throw { error: "Device not found." }

      mqttClient.publish(device?.topic || 'unknown', status ? 'turn-on' : 'turn-off')

      device.isLive = status
      await device.save()

      res.status(400).json({
        deviceId: device?.id,
        isLive: device?.isLive,
      })
    } catch (error) {
      res.status(400).json(error)
    }
  }
}
