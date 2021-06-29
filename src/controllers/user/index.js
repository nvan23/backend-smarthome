'use strict'
const validator = require('validator')
const bcrypt = require('bcryptjs')

const User = require("../../models/user.model")

exports.register = async (req, res) => {
  try {
    const { email } = req.body
    const isUser = await User.findOne({ email })

    if (isUser) return res.status(406).json({ message: "Email already exists." })

    const user = new User(req.body)
    await user.save()
    await user.initUserRole()

    res.status(200).json({ msg: 'Register successfully.' })

  } catch (error) {
    res.status(400).json(error.errors)
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) throw { error: 'User name and password are incorrect.' }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) throw { error: 'User name and password are incorrect.' }

    if (user.isBlock || !user.roles.length) throw { error: "Your account was banned" }

    const token = await user.generateAuthToken()
    const refreshToken = await user.generateRefreshToken()

    return res.status(200).json({
      token,
      refreshToken,
      user,
    })
  } catch (error) {
    res.status(404).json(error)
  }
}

exports.me = (req, res) => {
  User
    .findById(req.user._id,)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(error => res.status(400).json(error))
}

exports.resetPassword = async (req, res) => {
  try {
    const email = req.body?.email?.trim()
    if (
      !email &&
      !validator.isEmail(email)
    )
      throw { error: 'Invalid email address' }

    const user = await User.findOne({ email: email })
    if (!user) throw { error: 'User not found' }

    // send mail using node mailer

    res.status(200).json("Please check your email to reset your password")
  } catch (error) {
    res.status(400).json(error)
  }

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

exports.logoutAll = async (req, res) => {
  User
    .findOneAndUpdate(
      { _id: req.user._id },
      {
        tokens: [],
      },
      { new: true }
    )
    .then(data => res.status(200).json(data))
    .catch(error => res.status(400).json(error))
}
