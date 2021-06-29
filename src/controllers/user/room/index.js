'use strict'

const Room = require("../../../models/room.model")
const User = require("../../../models/user.model")

const checker = require('../../../utils/checker')

exports.getAllRooms = async (req, res) => {
  try {
    User
      .findById(req.user.id)
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'rooms.roomId',
      })
      .select('rooms')
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.getRoom = async (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id)) throw { error: "Invalid input" }

    const room = await Room.findById(req.params.id)
    if (!room) throw { error: "Room not found" }

    res.status(200).json(room)
  } catch (error) {
    res.status(400).json(error)
  }
}
