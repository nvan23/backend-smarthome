'use strict'

const config = require('../../config')
const bcrypt = require('bcryptjs')

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

exports.login = async (req, res) => {
  const { email, password } = req.body

  // Search for a user by email and password.
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(404).json({ msg: 'Email and password are incorrect.' })
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)

  if (!isPasswordMatch) {
    return res.status(404).json({ msg: 'Email and password are incorrect.' })
  }

  const token = await user.generateAuthToken()
  const refreshToken = await user.generateRefreshToken()

  return res.status(200).json({
    msg: 'Logged in successfully.',
    token,
    refreshToken,
    user,
  })
}

exports.getAllEquipmentsOnUser = async (req, res) => {
  User
    .findById(req.user._id)
    .populate({
      path: 'equipments',
    })
    .sort({ createdAt: 'desc' })
    .then(user => {
      res.status(200).json({
        amount: user.equipments.length,
        equipments: user.equipments.map(equipment => {
          return {
            id: equipment._id,
            name: equipment.name,
            type: equipment.type,
            status: equipment.status,
            description: equipment.description || '',
            createdAt: new Date(equipment.createdAt).toLocaleDateString('en-US'),
          }
        }),
      })
    })
    .catch(error => {
      res.status(400).json(error)
    })
}

exports.logout = async (req, res) => {
  User
    .findOneAndUpdate(
      { _id: req.user._id },
      {
        refreshToken: '',
        $pull: { tokens: { token: [req.headers['x-access-token']] } }
      },
      { new: true }
    )
    .then(() => res.status(200).json({ msg: 'Logout successfully' }))
    .catch(error => res.status(500).json(error))
}

exports.logoutAllDevices = async (req, res) => {
  User
    .findOneAndUpdate(
      { _id: req.user._id },
      {
        refreshToken: '',
        tokens: [],
      },
      { new: true }
    )
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).json(error))
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

exports.block = async (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id))
      throw { error: "Invalid input" }

    User
      .findByIdAndUpdate(
        req.params.id,
        { isBlock: true },
        { new: true }
      )
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    return res.status(400).json(error)
  }

}

exports.active = (req, res) => {
  try {
    if (!checker.isObjectId(req.params.id))
      throw { error: "Invalid input" }

    User
      .findByIdAndUpdate(
        req.params.id,
        { isBlock: false },
        { new: true }
      )
      .then(data => res.status(200).json(data))
      .catch(error => res.status(400).json(error))
  } catch (error) {
    return res.status(400).json(error)
  }

}
