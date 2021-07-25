'use strict'

const Home = require("../../models/home.model")
const Room = require("../../models/room.model")
const User = require("../../models/user.model")
const Camera = require("../../models/camera.model")

const checker = require('../../utils/checker')

const mqttHandler = require('../../services/mqtt')
const mqttClient = new mqttHandler()
mqttClient.connect()

exports.getAllCameras = async (req, res) => {
  try {
    Camera
      .find({ homeId: req.home.id })
      .sort({ createdAt: 'desc' })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.getCamera = async (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id)) throw { error: "Invalid input" }

    const camera = await Camera.findById(req.params.id)
    if (!camera) throw { error: "Camera not found" }

    res.status(200).json(camera)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.create = async (req, res) => {
  try {
    const name = req.body?.name?.trim()
    const ip = req.body?.ip?.trim()

    if (!name && !ip)
      throw { error: "Input error - Input empty" }

    const user = await User.findById(req.user.id)
    if (!user) throw { error: "User not found" }
    if (!user.homeId) throw { error: "Your home not found" }

    const home = await Home.findById(user.homeId)
    if (!home) throw { error: "Home not found" }

    const isCameraNameExist = await Camera.find({ name: name })
    if (isCameraNameExist.length)
      throw { error: "Camera name already exists." }

    const isCameraIpExist = await Camera.find({ ip: ip })
    if (isCameraIpExist.length)
      throw { error: "Camera IP already exists." }

    req.body.homeId = home.id

    const camera = new Camera(req.body)
    if (!camera) throw { error: "Cannot create a new camera at your home" }
    await camera.save()
    res.status(200).json(camera)

    await Home.findByIdAndUpdate(
      req.home.id,
      {
        $push: { cameras: camera.id }
      },
      { new: true }
    )

  } catch (error) {
    res.status(400).json(error)
  }
}

exports.blockAllCameras = (status) => {
  return function (req, res) {
    Camera
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

      const camera = await Camera.findByIdAndUpdate(
        req.params.id,
        { isBlock: status },
        { new: true }
      )

      if (!camera) throw { error: "Cannot block this camera" }

      res.status(200).json(camera)
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}

exports.update = async (req, res) => {
  try {
    const name = req.body?.name?.trim()
    const ip = req.body?.ip?.trim()

    if (!checker.isObjectId(req.params.id))
      throw { error: "Camera not found" }

    const isCameraNameExist = await Camera.find({ name: name })
    if (isCameraNameExist.length)
      throw { error: "Camera name already exists." }

    const isCameraIpExist = await Camera.find({ ip: ip })
    if (isCameraIpExist.length)
      throw { error: "Camera IP already exists." }

    const camera = await Camera.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!camera) throw { error: "Cannot update this camera at the home" }

    res.status(200).json(camera)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.delete = async (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id))
      throw { error: "Invalid input" }

    const camera = await Camera.findById(req.params.id)
    if (!camera) throw { error: "Camera not found" }

    if (camera?.homeId.toString() !== req.home.id.toString())
      throw { error: "Not authorized to remove this camera" }

    const deleteProcess = await Camera.findByIdAndDelete(camera.id)

    if (!deleteProcess) throw { error: "Cannot delete camera at now" }
    res.status(200).json({ message: "Camera was deleted successfully" })

    await Home.findByIdAndUpdate(
      req.home.id,
      {
        $pull: { cameras: camera.id }
      },
      { new: true }
    )
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.deleteAllCameras = async (req, res) => {
  try {
    await Camera.deleteMany({ homeId: req.home.id })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))

    await Home.findByIdAndUpdate(req.home.id, { cameras: [] })
  } catch (error) {
    res.status(400).json(error)
  }
}