'use strict'

const Home = require("../../../models/home.model")
const Room = require("../../../models/room.model")
const User = require("../../../models/user.model")

const checker = require('../../../utils/checker')

exports.getAllMembers = async (req, res) => {
  try {
    Room
      .findById(req.room.id)
      .then(data => res.status(200).json(data.members))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.create = async (req, res) => {
  try {
    if (!req.body.userId || !checker.isObjectId(req.body.userId))
      throw { error: "Invalid input" }

    const user = await User.findById(req.body.userId)
    if (!user) throw { error: "User not found" }

    const room = await Room.findById(req.room.id)

    if (room.members.includes(req.body.userId))
      throw { error: "User already exist at this room" }

    const addMember = await Room
      .findByIdAndUpdate(
        req.room.id,
        { $push: { members: user.id } },
        { new: true }
      )

    if (!addMember) throw { error: "Cannot add member at now" }

    if (user.homeId !== req.home.id) {
      const updateCurrentHomeUser = await User
        .findByIdAndUpdate(
          req.body.userId,
          { currentHome: req.home.id }
        )
      if (!updateCurrentHomeUser)
        throw { error: "Cannot update current home at now" }
    }

    if (!user.rooms.includes(req.room.id)) {
      const updateRoomsUser = await User
        .findByIdAndUpdate(
          user.id,
          { $push: { rooms: req.room.id } },
          { new: true }
        )
      if (!updateRoomsUser) throw { error: "Cannot update rooms of user" }
    }

    res.status(200).json(addMember)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.delete = async (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id))
      throw { error: "Invalid input" }

    const user = await User
      .findByIdAndUpdate(
        req.params.id,
        { $pull: { rooms: req.room.id } },
        { new: true }
      )
    if (!user) throw { error: "Cannot update rooms of user" }

    if (!user?.rooms) {
      user.currentHome = null
      await user.save()
    }

    const lastRoom = user.rooms[user.rooms.length - 1]
    const previousRoom = await Room.findById(lastRoom)
    if (previousRoom) {
      user.currentHome = previousRoom.homeId
    }

    const room = await Room
      .findByIdAndUpdate(
        req.room.id,
        { $pull: { members: req.params.id } },
        { new: true }
      )
    if (!room) throw { error: "Cannot remove member at this room" }

    res.status(200).json(room)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.deleteAllMembers = async (req, res) => {
  try {
    await Room.findByIdAndUpdate(
      req.room.id,
      { members: [] },
      { new: true }
    )
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))

  } catch (error) {
    res.status(400).json(error)
  }
}
