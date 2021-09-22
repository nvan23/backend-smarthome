const Room = require('../models/room.model')
const User = require('../models/user.model')

const requireInRoom = () => {
  return async function (req, res, next) {
    try {
      const user = await User.findById(req.user.id)
      if (!user) throw { error: "User not found" }

      const room = await Room.findById(req.room.id)
      if (!room) throw { error: "Room not found" }

      const userInRoom = user?.rooms.some(r => r?.roomId.toString() === req?.room?.id.toString())
      if (!user?.homeId && !userInRoom)
        throw { error: "You not in this room" }

      next()
    } catch (error) {
      res.status(401).json(error)
    }
  }
}

module.exports = requireInRoom
