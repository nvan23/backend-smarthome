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

    if (room.members.some(m => m?.userId?.toString() === req.body?.userId?.trim().toString()))
      throw { error: "User already exist at this room" }

    const addMember = await Room
      .findByIdAndUpdate(
        req.room.id,
        { $push: { members: { userId: user.id } } },
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
          { $push: { rooms: { roomId: room.id } } },
          { new: true }
        )
      if (!updateRoomsUser) throw { error: "Cannot update rooms of user" }
    }

    res.status(200).json(addMember)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.block = (status) => {
  return async function (req, res) {
    try {
      if (!checker.isObjectId(req.params.id))
        throw { error: "Invalid input" }

      const user = await User.findById(req.params.id)
      if (!user) throw { error: "User not found" }

      user.rooms.forEach(room => {
        if (room.roomId.toString() === req.room.id.toString())
          room.isBlock = status
      })

      await user.save()

      const room = await Room.findById(req.room.id)
      room.members.forEach(member => {
        if (member.userId.toString() === user.id.toString())
          member.isBlock = status
      })
      await room.save()

      res.status(200).json(room)
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}

exports.blockAllMembers = (status) => {
  return async function (req, res) {
    try {
      const room = await Room.findById(req.room.id)

      if (!room.members.length)
        throw { error: "No member in the room" }

      const members = room.members.map(m => m)

      room.members.forEach(member => member.isBlock = status)
      await room.save()

      members.forEach(async member => {
        const user = await User.findById(member?.userId)
        user.rooms.forEach(room => {
          if (room.roomId.toString() === req.room.id.toString())
            room.isBlock = status
        })

        await user.save()
      })

      res.status(200).json(room)
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}

exports.delete = async (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id))
      throw { error: "Invalid input" }

    const user = await User
      .findByIdAndUpdate(
        req.params.id,
        { $pull: { rooms: { roomId: req.room.id } } },
        { new: true }
      )
    if (!user) throw { error: "Cannot update rooms of user" }

    const room = await Room
      .findByIdAndUpdate(
        req.room.id,
        { $pull: { members: { userId: req.params.id } } },
        { new: true }
      )
    if (!room) throw { error: "Cannot remove member at this room" }

    if (!user?.rooms.length) {
      user.homeId ? user.currentHome = user.homeId : user.currentHome = null
      await user.save()
    } else {
      const activeRoom = user.rooms.filter(r => r.isBlock === true)
      const lastRoom = activeRoom[activeRoom.length - 1]

      const previousRoom = await Room.findById(lastRoom)

      if (previousRoom) {
        user.currentHome = previousRoom.homeId
      }
    }

    res.status(200).json(room)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.deleteAllMembers = async (req, res) => {
  try {
    const room = await Room.findById(req.room.id)
    if (!room) throw { error: "Cannot remove all members of this room" }

    room.members.forEach(async member => {
      const user = await User
        .findByIdAndUpdate(
          member.userId,
          { $pull: { rooms: { roomId: req.room.id } } },
          { new: true }
        )
      if (!user) throw { error: "Cannot update rooms of user" }

      if (!user?.rooms.length) {
        user.homeId ? user.currentHome = user.homeId : user.currentHome = null
        await user.save()
      } else {
        const activeRoom = user.rooms.filter(r => r.isBlock === true)
        const lastRoom = activeRoom[activeRoom.length - 1]

        const previousRoom = await Room.findById(lastRoom)

        if (previousRoom) {
          user.currentHome = previousRoom.homeId
        }
      }
    })

    room.members = []
    await room.save()

    res.status(200).json(room)
  } catch (error) {
    res.status(400).json(error)
  }
}
