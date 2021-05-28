'use strict'

const Home = require("../../models/home.model")
const User = require("../../models/user.model")

const checker = require('../../utils/checker')

exports.getHome = async (req, res) => {
  try {
    Home
      .findOne({ hostId: req.user.id })
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.update = async (req, res) => {
  try {
    if (!req.body.name || !req.body.name.trim()) throw { error: "Invalid input" }

    const home = await Home.findByIdAndUpdate(
      req.home.id,
      { name: req.body.name },
      { new: true }
    )

    if (!home) throw { error: "Cannot update your home at now" }

    res.status(200).json(home)
  } catch (error) {
    res.status(400).json(error)
  }
}
