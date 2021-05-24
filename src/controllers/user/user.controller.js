'use strict'

const bcrypt = require('bcryptjs')
const User = require("../../models/user.model")

exports.register = async (req, res) => {
  try {
    const { email } = req.body
    const isUser = await User.findOne({ email })

    if (isUser) return res.status(406).json({ msg: "Email already exists." })

    const user = new User(req.body)
    await user.save()

    res.status(200).json({ msg: 'Register successfully.' })

  } catch (error) {
    res.status(400).json(error)
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

exports.getProfile = (req, res) => {
  User
    .findById(req.user._id,).select("id name email role equipments tokens")
    .then(user => {
      res.status(200).json(user)
    })
    .catch(error => res.status(404).json(error))
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

exports.changeRole = (req, res) => {
  User
    .findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    )
    .then(user => res.status(200).json(user))
    .catch(error => res.status(400).json(error))
}

exports.getUsernameAndIdOfAllUsers = async (req, res) => {
  User
    .find({ deleted: false })
    .sort({ createdAt: 'desc' })
    .then(users => {
      res.status(200).json(users.map(user => {
        return {
          key: user._id,
          id: user._id,
          value: user.name,
        }
      }))
    })
    .catch(error => {
      res.status(400).json(error)
    })
}
