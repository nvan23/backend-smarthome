'use strict'

const Room = require("../../../../models/room.model")

exports.getAllMembers = async (req, res) => {
  try {
    Room
      .findById(req.room.id)
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'members.userId',
        select: 'name isBlock'
      })
      .then(data => res.status(200).json(data.members))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    res.status(400).json(error)
  }
}
