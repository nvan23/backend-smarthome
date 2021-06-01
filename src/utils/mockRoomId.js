const Room = require('../models/room.model')
const checker = require('../utils/checker')

const mockRoomId = () => {
  return async function (req, res, next) {
    try {
      if (!checker.isObjectId(req.params.id))
        throw { error: "Invalid input" }

      const room = await Room.findById(req.params.id)
      if (!room) throw { error: "Room not found" }

      const roomIdObj = { id: room._id }

      req.room = roomIdObj
      next()
    } catch (error) {
      res.status(401).json(error)
    }
  }
}
module.exports = mockRoomId
