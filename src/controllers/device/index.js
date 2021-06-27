'use strict'

const Home = require("../../models/home.model")
const Room = require("../../models/room.model")
const User = require("../../models/user.model")
const Device = require("../../models/device.model")

const checker = require('../../utils/checker')

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
    if (
      !req.body?.name?.trim() &&
      !req.body?.publisher?.trim() &&
      !req.body?.subscriber?.trim()
    )
      throw { error: "Input error" }

    const user = await User.findById(req.user.id)
    if (!user) throw { error: "Cannot found user" }
    if (!user.homeId) throw { error: "Cannot found your house" }

    const home = await Home.findById(user.homeId)
    if (!home) throw { error: "Cannot found home" }

    req.body.homeId = home._id

    const device = new Device(req.body)
    if (!device) throw { error: "Cannot create a new device at your home" }
    await device.save()
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
    if (!checker.isObjectId(req.params.id))
      throw { error: "Device not found" }

    if (
      !req.body?.name?.trim() &&
      !req.body?.publisher?.trim() &&
      !req.body?.subscriber?.trim()
    )
      throw { error: "Input error" }

    const device = await Device.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body?.name?.trim(),
        publisher: req.body?.publisher?.trim(),
        subscriber: req.body?.subscriber?.trim(),
        description: req.body?.description?.trim(),
      },
      { new: true }
    )

    if (!device) throw { error: "Cannot update this device at the home" }

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