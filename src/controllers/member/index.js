'use strict'

const Home = require("../../models/home.model")
const Room = require("../../models/room.model")
const User = require("../../models/user.model")

const checker = require('../../utils/checker')

exports.getAllMembers = async (req, res) => {
  try {
    Room
      .find({ homeId: req.home.id })
      .populate({
        path: 'members',
        select: 'id name username email isBlock homes'
      })
      .sort({ createdAt: 'desc' })
      .then(data => {
        let membersContainer = []

        data.forEach(room => {
          membersContainer = [...membersContainer, ...room?.members]
          return membersContainer
        })

        const members = [...new Set(membersContainer)]
        res.status(200).json(members)
      })
      .catch(error => res.status(400).json(error))
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
