'use strict'

const Home = require("../../models/home.model")
const Room = require("../../models/room.model")
const User = require("../../models/user.model")

const checker = require('../../utils/checker')

exports.getAllRooms = async (req, res) => {
  Room
    .find()
    .sort({ createdAt: 'desc' })
    .then(data => res.status(200).json(data))
    .catch(error => res.status(400).json(error))
}

exports.create = async (req, res, next) => {
  try {
    if (!req.body?.name?.trim()) throw { error: "Input error" }

    const user = await User.findById(req.user.id)
    if (!user) throw { error: "Cannot found user" }
    if (!user.homeId) throw { error: "Cannot found your house" }

    const home = await Home.findById(user.homeId)
    if (!home) throw { error: "Cannot found home" }

    const rooms = await Room.find({ homeId: user.homeId })

    const isExistedRoom = rooms.some(r => r.name === req.body?.name?.trim().toString())
    if (isExistedRoom) throw { error: "Room name already exists" }

    req.body.homeId = home._id

    const room = new Room(req.body)
    if (!room) throw { error: "Cannot create a new room at your home" }

    await room.save()

    return next()
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.autoRoomToHome = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) throw { error: "Cannot found user" }

    const room = await Room.findOne({ homeId: user.homeId })
    if (!room) throw { error: "Cannot find room" }

    const home = await Home
      .findByIdAndUpdate(
        user.homeId,
        { $push: { rooms: room._id } },
        { new: true }
      )

    if (!home) throw { error: "Cannot found home" }

    return res.status(200).json(room)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.deleteAllRooms = async (req, res) => {
  await Room.deleteMany()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(400).json(error))
  await Home.updateMany({}, { rooms: [] })
}
