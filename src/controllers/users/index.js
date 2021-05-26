'use strict'

const config = require('../../config')

const Role = require('../../models/role.model')
const User = require("../../models/user.model")

const checker = require('../../utils/checker')

exports.getAllUsers = async (req, res) => {
  User
    .find()
    .sort({ createdAt: 'desc' })
    .then(data => res.status(200).json(data))
    .catch(error => res.status(400).json(error))
}

exports.getUser = async (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id))
      throw { error: "Invalid input" }

    const user = await User.findById(req.params.id)

    if (!user) throw { error: "Cannot found user" }

    return res.status(200).json(user)
  } catch (error) {
    res.status(404).json(error)
  }
}

exports.changeRole = async (req, res) => {
  try {
    if (!req.body || !req.body.role || !checker.isObjectId(req.body.role))
      throw { error: "Role input error" }

    const roles = await Role.find()

    const roleIds = roles.map(role => role._id.toString())
    if (!roleIds.includes(req.body.role)) throw { error: "Cannot found role" }

    const user = await User.findById(req.params.id)
    if (user.roles.includes(req.body.role)) throw { error: "Role already exists" }

    User
      .findByIdAndUpdate(
        req.params.id,
        { $push: { roles: req.body.role } },
        { new: true }
      )
      .then(user => res.status(200).json(user))
      .catch(error => res.status(400).json(error))
  }
  catch (error) {
    res.status(400).json(error)
  }
}

exports.resetRole = async (req, res) => {
  const userRole = await Role.findOne({ key: config.roles.user })

  User
    .findByIdAndUpdate(
      req.params.id,
      { roles: [userRole] },
      { new: true }
    )
    .then(user => res.status(200).json(user))
    .catch(error => res.status(400).json(error))
}

exports.resetHome = async (req, res) => {
  User
    .findByIdAndUpdate(
      req.params.id,
      { homeId: null },
      { new: true }
    )
    .then(user => res.status(200).json(user))
    .catch(error => res.status(400).json(error))
}

exports.updateAllRolesOfAllUsers = (req, res) => {
  User
    .find()
    .then(data => {
      data.forEach(doc => {
        doc.roles.forEach(role => {
          console.log(role)
        })
      })
      return res.status(400).json(data)
    })
}

exports.deleteAllUsers = (req, res) => {
  User
    .deleteMany()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(400).json(error))
}

exports.delete = (req, res) => {
  User
    .deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Delete an user successfully" }))
    .catch(error => res.status(400).json(error))
}

exports.block = (status) => {
  return async function (req, res) {
    try {
      if (!checker.isObjectId(req.params.id))
        throw { error: "Invalid input" }

      User
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

