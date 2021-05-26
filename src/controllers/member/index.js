'use strict'

const Home = require("../../models/home.model")
const Room = require("../../models/room.model")
const User = require("../../models/user.model")

const checker = require('../../utils/checker')

exports.getAllMembers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) throw { error: "Cannot found user" }

    const home = await Home.findById(user.homeId)
    if (!home) throw { error: "Cannot found your home" }

    console.log(home.rooms)

    res.status(200).json("hehe")
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.update = async (req, res) => {
  try {
    if (!req.body.name || !req.body.name.trim()) throw { error: "Invalid input" }

    const user = await User.findById(req.user.id)
    if (!user) throw { error: "Cannot found user" }

    const home = await Home.findByIdAndUpdate(
      user.homeId,
      { name: req.body.name },
      { new: true }
    )

    if (!home) throw { error: "Cannot update your home at now" }

    res.status(200).json(home)
  } catch (error) {
    res.status(400).json(error)
  }
}
