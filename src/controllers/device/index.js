'use strict'

const Home = require("../../models/home.model")
const Room = require("../../models/room.model")
const User = require("../../models/user.model")
const Device = require("../../models/device.model")

const checker = require('../../utils/checker')
const deviceObjTypes = require('../../constants/deviceTypes')

const mqttHandler = require('../../services/mqtt')
const mqttClient = new mqttHandler()
mqttClient.connect()

const devicesTypes = Object.values(deviceObjTypes) || []

exports.getAllDevices = async (req, res) => {
  try {
    Device
      .find({ homeId: req.home.id })
      .sort({ createdAt: 'desc' })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.getDevice = async (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id)) throw { error: "Invalid input" }

    const device = await Device.findById(req.params.id)
    if (!device) throw { error: "Device not found" }

    res.status(200).json(device)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.create = async (req, res) => {
  try {
    const name = req.body?.name?.trim()
    const topic = req.body?.topic?.trim()
    const type = req.body?.type?.trim()

    if (!name && !topic && !type)
      throw { error: "Input error - Input empty" }

    if (!devicesTypes.includes(type))
      throw { error: "Input error - Not found device type" }

    const user = await User.findById(req.user.id)
    if (!user) throw { error: "User not found" }
    if (!user.homeId) throw { error: "Your home not found" }

    const home = await Home.findById(user.homeId)
    if (!home) throw { error: "Home not found" }

    const isDeviceNameExist = await Device.find({ name: name })
    if (isDeviceNameExist.length)
      throw { error: "Device name already exists." }

    const isDeviceTopicExist = await Device.find({ topic: topic })
    if (isDeviceTopicExist.length)
      throw { error: "Topic channel already exists." }

    req.body.homeId = home.id

    const device = new Device(req.body)
    if (!device)
      throw { error: "Cannot create a new device at your home" }

    await device.save()
    mqttClient.subscribe(topic)
    res.status(200).json(device)

    await Home.findByIdAndUpdate(
      req.home.id,
      {
        $push: { devices: device.id }
      },
      { new: true }
    )

  } catch (error) {
    res.status(400).json(error)
  }
}

exports.blockAllDevices = (status) => {
  return function (req, res) {
    Device
      .updateMany(
        { homeId: req.home.id },
        { isBlock: status },
        { new: true }
      )
      .then(data => res.status(200).json(data))
      .error(error => res.status(400).json(error))
  }
}

exports.block = (status) => {
  return async function (req, res) {
    try {
      if (!checker.isObjectId(req.params.id))
        throw { error: "Invalid input" }

      const device = await Device.findByIdAndUpdate(
        req.params.id,
        { isBlock: status },
        { new: true }
      )

      if (!device) throw { error: "Cannot block this device" }

      res.status(200).json(device)
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}

exports.update = async (req, res) => {
  try {
    const deviceId = req.params?.id
    const name = req.body?.name?.trim()
    const topic = req.body?.topic?.trim()
    const type = req.body?.type?.trim()
    const roomId = req.body?.roomId?.trim()

    if (!checker.isObjectId(deviceId))
      throw { error: "Input error - Device not found" }

    const isDeviceNameExist = await Device.find({ name: name })
    if (isDeviceNameExist.length)
      throw { error: "Device name already exists." }

    const isDeviceTopicExist = await Device.find({ topic: topic })
    if (isDeviceTopicExist.length)
      throw { error: "Topic channel already exists." }

    if (type && !devicesTypes.includes(type))
      throw { error: "Input error - Type not found" }

    const device = await Device.findById(deviceId)
    if (!device) throw { error: "Device not found" }

    if (!checker.isObjectId(roomId))
      throw { error: "Input error - Room not found" }

    const room = await Room.findById(roomId)
    if (!room) throw { error: "Room not found" }

    const updatedDevice = await Device.findByIdAndUpdate(
      deviceId,
      req.body,
      { new: true }
    )

    if (!updatedDevice)
      throw { error: "Cannot update this device at the home" }

    if (device?.roomId &&
      device?.roomId.toString() !== roomId &&
      !room?.devices.includes(deviceId)
    ) {
      await Room
        .findByIdAndUpdate(
          device?.roomId.toString(),
          { $pull: { devices: deviceId } },
          { new: true }
        )

      await Room
        .findByIdAndUpdate(
          roomId,
          { $push: { devices: deviceId } },
          { new: true }
        )
    } else if (!device?.roomId) {
      await Room
        .findByIdAndUpdate(
          roomId,
          { $push: { devices: deviceId } },
          { new: true }
        )
    }

    mqttClient.subscribe(topic || device.topic)

    res.status(200).json(updatedDevice)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.delete = async (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id))
      throw { error: "Invalid input" }

    const device = await Device.findById(req.params.id)
    if (!device) throw { error: "Device not found" }

    if (device?.homeId.toString() !== req.home.id.toString())
      throw { error: "Not authorized to remove this device" }

    const deleteProcess = await Device.findByIdAndDelete(device.id)

    if (!deleteProcess) throw { error: "Cannot delete device at now" }
    res.status(200).json({ message: "Device was deleted successfully" })

    await Home.findByIdAndUpdate(
      req.home.id,
      {
        $pull: { devices: device.id }
      },
      { new: true }
    )
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.deleteAllDevices = async (req, res) => {
  try {
    await Device.deleteMany({ homeId: req.home.id })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))

    await Home.findByIdAndUpdate(req.home.id, { devices: [] })
  } catch (error) {
    res.status(400).json(error)
  }
}