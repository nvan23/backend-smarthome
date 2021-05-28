'use strict'

const Home = require("../../models/home.model")
const User = require("../../models/user.model")

const checker = require('../../utils/checker')

exports.getAllHomes = async (req, res) => {
  Home
    .find()
    .sort({ createdAt: 'desc' })
    .then(data => res.status(200).json(data))
    .catch(error => res.status(400).json(error))
}

exports.getHome = async (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id))
      throw { error: "Invalid input" }
    Home
      .findById(req.params.id)
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    res.status(400).json(error)
  }

}

exports.create = async (req, res, next) => {
  try {
    if (
      !req.body ||
      !req.body.name ||
      !req.body.hostId ||
      !checker.isObjectId(req.body.hostId)
    )
      throw { error: "Input error" }

    const user = await User.findById(req.body.hostId)
    if (!user) throw { error: "Cannot found user" }

    if (user.homeId)
      throw { error: "This customer is already the owner of another home." }

    const home = new Home(req.body)
    if (!home) throw { error: "Cannot create a new home at now" }

    await home.save()

    return next()
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.transferHomeToHost = async (req, res) => {
  try {
    const home = await Home.findOne({ hostId: req.user.id })
    if (!home) throw { error: "Cannot found home" }

    await User
      .findByIdAndUpdate(
        req.user.id,
        { homeId: home._id },
        { new: true }
      )

    return res.status(200).json(home)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.block = (status) => {
  return async function (req, res) {
    try {
      if (!checker.isObjectId(req.params.id))
        throw { error: "Invalid input" }

      Home
        .findByIdAndUpdate(
          req.params.id,
          { isBlock: status },
          { new: true }
        )
        .then(data => res.status(200).json(data))
        .catch(error => res.status(400).json(error))
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}

exports.deleteAllHomes = async (req, res) => {
  Home
    .deleteMany()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(400).json(error))
  await User
    .updateMany(
      {},
      { homeId: null },
      { new: true }
    )
}

exports.delete = async (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id))
      throw { error: "Invalid input" }

    await User
      .findByIdAndUpdate(
        req.user.id,
        { homeId: null },
        { new: true }
      )

    Home
      .deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json("Delete home successfully"))
      .catch(error => res.status(400).json(error))

  } catch (error) {
    res.status(400).json(error)
  }
}
