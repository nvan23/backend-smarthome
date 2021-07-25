const Room = require('../models/room.model')

const requireInRoom = () => {
  return async function (req, res, next) {
    try {
      const room = await Room.findById(req.room.id)
      if (!room) throw { error: "Room not found" }

      const userInRoom = room?.members.some(m => m?.userId.toString() === req.user.id)
      if (!userInRoom)
        throw { error: "You not in this room" }

      next()
    } catch (error) {
      res.status(401).json(error)
    }
  }
}

module.exports = requireInRoom
