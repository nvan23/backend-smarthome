'use strict'
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require("../../models/user.model")
const Token = require("../../models/token.model")

const mailer = require('../../utils/mail')
const htmlMail = require('../../utils/templates/forgotPasswordTemplate')
const htmlMailVerify = require('../../utils/templates/verifyAccountTemplate')
const htmlMailChangeEmail = require('../../utils/templates/changeEmailTemplate')

const config = require('../../config')

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
    .findById(req.user._id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(error => res.status(400).json(error))
}

exports.addEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (user?.email) throw { error: "This account already exists email." }

    const email = req.body?.email?.trim()
    if (!email) throw { error: "Invalid input" }

    if (!validator.isEmail(email))
      throw { error: "Email address is invalid" }

    const isExistedEmail = await User.find({ email: email })
    if (isExistedEmail?.length) throw { error: "This email already register." }

    const token = jwt.sign(
      {
        id: user.id,
        email: email,
      },
      config.email.secret,
      { expiresIn: config.email.tokenLife }
    )
    if (!token) throw { error: "Server Error - Generate token" }

    const tokenDoc = new Token({
      token: token
    })
    await tokenDoc.save()
    if (!tokenDoc) throw ({ error: "Server Error - Save token" })

    mailer.sendMail(
      'Account Verification',
      email,
      htmlMailVerify.verifyAccountTemplate(`http://localhost:3000/api/v1/user/email/new/${token}`)
    )

    res.status(200).json({ message: "Please check your email to verify your account" })
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.confirmEmail = async (req, res) => {
  try {
    const token = req.params?.token?.trim()
    if (!token) throw { error: 'Invalid input' }

    jwt.verify(token, config.email.secret, async (err, decoded) => {
      try {
        if (err) throw { error: 'Token expired' }

        const getToken = await Token.findOne({ token: token })
        if (!getToken) throw { error: "Token not found" }
        if (getToken.changed)
          throw { error: "Verification account session is no longer available." }

        const user = await User.findById(decoded?.id).select('id')
        if (!user) throw { error: 'User not found' }

        user.email = decoded?.email
        await user.save()

        getToken.changed = true
        await getToken.save()

        res.status(200).json({ message: "Updated your email address successfully" })
      } catch (error) {
        res.status(400).json(error)
      }
    })
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.requestEmailChange = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user?.email)
      throw { error: "Your account is not have email address" }

    const token = jwt.sign(
      { id: user.id },
      config.email.secret,
      { expiresIn: config.email.tokenLife }
    )
    if (!token) throw { error: "Server Error - Generate token" }

    const tokenDoc = new Token({
      token: token
    })
    await tokenDoc.save()
    if (!tokenDoc) throw ({ error: "Server Error - Save token" })

    mailer.sendMail(
      'Change Email Address',
      user?.email,
      htmlMailChangeEmail.changeEmailTemplate(`http://localhost:3000/api/v1/user/email/${token}`)
    )

    res.status(200).json({ message: "Please check your email to verify your account" })
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.getDataChangeEmail = async (req, res) => {
  try {
    const token = req.params?.token?.trim()
    if (!token) throw { error: 'Invalid input' }

    jwt.verify(token, config.email.secret, async (err, decoded) => {
      try {
        if (err) throw { error: 'Token expired' }

        const getToken = await Token.findOne({ token: token })
        if (!getToken) throw { error: "Token not found" }

        const user = await User.findById(decoded?.id).select('id')
        if (!user) throw { error: 'User not found' }

        res.status(200).json({ id: user.id })
      } catch (error) {
        res.status(400).json(error)
      }
    })
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.changeEmail = async (req, res) => {
  try {
    const token = req.params?.token?.trim()
    if (!token) throw { error: 'Invalid input' }

    jwt.verify(token, config.email.secret, async (err, decoded) => {
      try {
        if (err) throw { error: 'Token expired' }

        const getToken = await Token.findOne({ token: token })
        if (!getToken) throw { error: "Token not found" }
        if (getToken.changed)
          throw { error: "Email address change session is no longer available." }

        const newEmail = req.body?.email?.trim()
        if (!newEmail) throw { error: "Invalid email input" }

        const isExistedEmail = await User.find({ email: newEmail })
        if (isExistedEmail.length)
          throw { error: "New email address already exist on other account" }

        const user = await User.findById(decoded?.id).select('id email')
        if (!user) throw { error: "User not found" }
        if (!user?.email) throw { error: "Your account not have email address" }
        if (user?.email === newEmail)
          throw { error: "New email address must not be same current email address" }

        getToken.changed = true
        await getToken.save()

        const newToken = jwt.sign(
          {
            id: user.id,
            email: newEmail,
          },
          config.email.secret,
          { expiresIn: config.email.tokenLife }
        )
        if (!token) throw { error: "Server Error - Generate token" }

        const tokenDoc = new Token({
          token: newToken
        })
        await tokenDoc.save()
        if (!tokenDoc) throw ({ error: "Server Error - Save token" })

        mailer.sendMail(
          'Account Verification',
          newEmail,
          htmlMailVerify.verifyAccountTemplate(`http://localhost:3000/api/v1/user/email/new/${newToken}`)
        )

        res.status(200).json({ message: "Please check the new email to change email of your account" })
      } catch (error) {
        res.status(400).json(error)
      }
    })
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body?.email?.trim()
    if (!email)
      throw { error: 'Email not empty' }

    if (!validator.isEmail(email))
      throw { error: 'Invalid email address' }

    const user = await User.findOne({ email: email })
    if (!user) throw { error: 'User not found' }

    const token = jwt.sign(
      { id: user.id },
      config.email.secret,
      { expiresIn: config.email.tokenLife }
    )
    if (!token) throw { error: "Server Error - Generate token" }

    const tokenDoc = new Token({
      token: token
    })
    await tokenDoc.save()
    if (!tokenDoc) throw ({ error: "Server Error - Save token" })

    mailer.sendMail(
      'Reset Password',
      email,
      htmlMail.forgotPasswordTemplate(`http://localhost:3000/api/v1/user/reset-password/${token}`)
    )

    res.status(200).json({ message: "Please check your email to reset your password" })
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const token = req.params?.token?.trim()
    if (!token) throw { error: 'Invalid input' }

    jwt.verify(token, config.email.secret, async (err, decoded) => {
      try {
        if (err) throw { error: 'Token expired' }

        const getToken = await Token.findOne({ token: token })
        if (!getToken) throw { error: "Token not found" }

        const user = await User.findById(decoded.id).select('id')
        if (!user) throw { error: 'User not found' }

        res.status(200).json({ userId: user, isChanged: getToken.changed })
      } catch (error) {
        res.status(400).json(error)
      }
    })
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.changePassword = (req, res) => {
  try {
    const token = req.params?.token?.trim()
    if (!token) throw { error: 'Invalid input' }

    const newPassword = req.body?.newPassword?.trim()

    jwt.verify(token, config.email.secret, async (err, decoded) => {
      try {
        if (err) throw { error: 'Token expired' }

        const getToken = await Token.findOne({ token: token })
        if (!getToken) throw { error: "Token not found" }
        if (getToken.changed) throw { error: "Password change session is no longer available." }

        const user = await User.findById(decoded.id)
        if (!user) throw { error: 'User not found' }

        user.password = newPassword
        await user.save()

        getToken.changed = true
        await getToken.save()

        res.status(200).json({
          message: 'Reset password successfully',
          isChanged: getToken.changed
        })
      } catch (error) {
        res.status(400).json(error)
      }
    })
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

