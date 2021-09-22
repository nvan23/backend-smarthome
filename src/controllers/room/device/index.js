'use strict'

const Room = require("../../../models/room.model")
const Device = require("../../../models/device.model")
const User = require("../../../models/user.model")

const checker = require('../../../utils/checker')

const mqttHandler = require('../../../services/mqtt')
const mqttClient = new mqttHandler()
mqttClient.connect()

exports.getAllDevices = async (req, res) => {
  try {
    if (!checker.isObjectId(req.room.id))
      throw { error: "Invalid input" }

    Device
      .find({ roomId: req.room.id })
      .sort({ createdAt: 'desc' })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.getAllDevicesWithType = async (req, res) => {
  try {
    const type = req.params?.type.trim()

    Device
      .find({ roomId: req.room.id, type: type })
      .sort({ createdAt: 'desc' })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.addDevice = async (req, res) => {
  try {
    if (!checker.isObjectId(req.room.id))
      throw { error: "Invalid input" }

    if (
      !req.body?.deviceId?.trim() &&
      !checker.isObjectId(req.body?.deviceId?.trim())
    )
      throw { error: "Invalid input from user" }

    const device = await Device.findById(req.body?.deviceId?.trim())
    if (!device) throw { error: "Device not found" }
    if (device?.roomId)
      throw { error: "This device was used in another room" }

    const room = await Room
      .findByIdAndUpdate(
        req.room.id,
        {
          $push: { devices: device.id }
        },
        { new: true }
      )

    if (!room) throw { error: "Cannot add device to room " }
    res.status(200).json(room)

    await Device.findByIdAndUpdate(
      device.id,
      { roomId: room.id },
      { new: true }
    )
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.turnOn = (status) => {
  return async function (req, res) {
    try {
      const user = await User.findById(req.user.id)
      if (!user) throw { error: "User not found" }

      if (!user?.homeId && !user?.rooms.some(r => r.roomId.toString() === req?.room?.id))
        throw { error: "Member does not host or Member is not in this room" }

      if (!checker.isObjectId(req?.params?.id))
        throw { error: "Invalid input" }

      const device = await Device.findById(req?.params?.id)
      if (!device) throw { error: "Device not found." }

      if (device.roomId !== req?.room?.id)
        throw { error: "This device not in room" }

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

// exports.turnOnAuto = (status) => {
//   return async function (req, res) {
//     try {
//       const user = await User.findById(req.user.id)
//       if (!user) throw { error: "User not found" }

//       if (!user?.homeId && !user?.rooms.some(r => r.roomId.toString() === req?.room?.id))
//         throw { error: "Member does not host or Member is not in this room" }

//       if (!checker.isObjectId(req?.params?.id))
//         throw { error: "Invalid input" }

//       const device = await Device.findById(req?.params?.id)
//       if (!device) throw { error: "Device not found." }

//       if (device.roomId !== req?.room?.id)
//         throw { error: "This device not in room" }

//       if (!device?.isLive) throw { error: "Device is off" }

//       mqttClient.publish(`${device?.topic}/auto` || 'unknown', status ? '1' : '0')

//       device.autoRunStatus = status
//       await device.save()

//       res.status(200).json({
//         deviceId: device?.id,
//         status: device?.autoRunStatus,
//       })
//     } catch (error) {
//       res.status(400).json(error)
//     }
//   }
// }

exports.removeDevice = async (req, res) => {
  try {
    if (
      !checker.isObjectId(req?.room?.id) &&
      !checker.isObjectId(req?.params?.id?.trim())
    )
      throw { error: "Invalid input" }

    const device = await Device.findById(req?.params?.id?.trim())
    if (!device) throw { error: "Device not found" }
    if (!device.roomId) throw { error: "Device not found in this room" }

    const room = await Room
      .findByIdAndUpdate(
        req.room.id,
        {
          $pull: { devices: device.id }
        },
        { new: true }
      )

    if (!room) throw { error: "Cannot remove device in room " }
    res.status(200).json(room)

    await Device.findByIdAndUpdate(
      device.id,
      { roomId: null },
      { new: true }
    )
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.removeAllDevices = async (req, res) => {
  try {
    if (!checker.isObjectId(req?.room?.id))
      throw { error: "Invalid input" }

    const room = await Room
      .findByIdAndUpdate(
        req.room.id,
        { devices: [] },
        { new: true }
      )

    if (!room) throw { error: "Cannot remove all devices in room " }
    res.status(200).json(room)

    await Device.updateMany(
      { roomId: req.room.id },
      { roomId: null },
      { new: true }
    )
  } catch (error) {
    res.status(400).json(error)
  }
}

