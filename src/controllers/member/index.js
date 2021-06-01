'use strict'

const Home = require("../../models/home.model")
const Room = require("../../models/room.model")
const User = require("../../models/user.model")

const checker = require('../../utils/checker')

exports.getAllMembers = async (req, res) => {
  try {
    const home = await Home
      .findById(req.home.id)
      .populate({
        path: 'rooms',
        populate: {
          path: 'members'
        }
      })


    const getMembersPromise = home?.rooms.forEach(async r => {
      let membersContainer = []
      const membersOfRoom = await Room.findById(r)

      if (membersOfRoom)
        membersContainer = [...membersContainer, ...membersOfRoom?.members]

      return membersContainer
    })

    const getMembersPromiseAll = await Promise.all(getMembersPromise)

    console.log('getMembersPromiseAll', getMembersPromiseAll)

    const members = [...new Set(getMembersPromiseAll)]
    res.status(200).json(members)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.getMember = async (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id))
      throw { error: "Invalid input" }

    const member = await User
      .findById(req.params.id)
      .select('isBlock name username email')

    if (!member) throw { error: "Member not found" }

    res.status(200).json(member)
  } catch (error) {
    res.status(400).json(error)
  }
}
