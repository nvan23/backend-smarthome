'use strict'

const User = require("../../../../models/user.model")
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

exports.getAllDevicesWithType = async (req, res) => {
  try {
    const type = req.params?.type?.trim()
    const roomId = req.room.id
    if (!checker.isObjectId(roomId))
      throw { error: "Input error - Invalid room ID" }

    const me = await User.findById(req.user.id)
    if (!me) throw { error: "Profile not found" }

    const roomIds = me?.rooms?.length ? me?.rooms?.map(r => r?.roomId) : []
    if (!roomIds.length)
      throw { error: "User have not any room at home" }

    if (!roomIds.includes(roomId))
      throw { error: "User do not in this room" }

    Device
      .find({ roomId: req.room.id, type: type })
      .sort({ createdAt: 'desc' })
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

exports.autoRun = (state) => {
  return async function (req, res) {
    try {
      const deviceId = req.params.id
      const roomId = req.room.id

      if (!checker.isObjectId(deviceId))
        throw { error: "Invalid input" }

      const device = await Device.findById(deviceId)

      if (!device)
        throw { error: "Device not found" }

      if (device.roomId.toString() !== roomId.toString())
        throw { error: "User can not use this feature" }

      if (!device.autoRun.baseOn)
        throw { error: "No sensor to get value" }

      device.autoRun.status = state
      await device.save()

      if (!device)
        throw { error: "Device not found" }

      res.status(200).json(device)
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}


exports.turnOn = (status) => {
  return async function (req, res) {
    try {

      if (!checker.isObjectId(req?.params?.id))
        throw { error: "Invalid input" }

      const device = await Device.findById(req?.params?.id)
      if (!device) throw { error: "Device not found." }

      mqttClient.publish(device?.topic || 'unknown', status ? '1' : '0')

      device.isLive = status
      await device.save()

      res.status(200).json({
        deviceId: device?.id,
        isLive: device?.isLive,
      })
    } catch (error) {
      res.status(400).json(error)
    }
  }
}
