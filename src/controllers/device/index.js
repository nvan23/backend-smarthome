'use strict'

const Home = require("../../models/home.model")
const Room = require("../../models/room.model")
const User = require("../../models/user.model")
const Device = require("../../models/device.model")

const checker = require('../../utils/checker')

const mqttHandler = require('../../services/mqtt')
const mqttClient = new mqttHandler()
mqttClient.connect()

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
    const hasData = req.body?.hasData

    if (!name && !topic) throw { error: "Input error" }

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
    hasData ? req.body.topic = topic + "has-data" : hasData

    const device = new Device(req.body)
    if (!device) throw { error: "Cannot create a new device at your home" }
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
    const name = req.body?.name?.trim()
    const topic = req.body?.topic?.trim()
    const description = req.body?.description?.trim()

    if (!checker.isObjectId(req.params.id))
      throw { error: "Device not found" }

    if (!name && !topic && !description)
      throw { error: "Input error - Not empty" }

    const device = await Device.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        topic: topic,
        description: description,
      },
      { new: true }
    )

    if (!device) throw { error: "Cannot update this device at the home" }

    mqttClient.subscribe(topic)

    res.status(200).json(device)
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