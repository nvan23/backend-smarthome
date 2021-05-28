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
    if (!req.body.name || !req.body.name.trim())
      throw { error: "Invalid input" }

    const home = await Home.findById(req.home.id)

    if (req.body.name === home.name)
      throw { error: "Home name already exists" }

    home.name = req.body.name
    home.save()

    if (!home) throw { error: "Cannot update your home at now" }

    res.status(200).json(home)
  } catch (error) {
    res.status(400).json(error)
  }
}
