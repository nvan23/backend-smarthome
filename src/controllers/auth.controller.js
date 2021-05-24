'use strict'

const jwt = require('jsonwebtoken')
const User = require("../models/user.model")

exports.refreshToken = async (req, res) => {
  try {
    // Get token refresh from body
    const refreshTokenFromBody = req.body.refreshToken;
    if (!refreshTokenFromBody) {
      return res.status(404).json({ msg: 'No refresh token found.' });
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ msg: 'User does not exist.' })
    }

    if (refreshTokenFromBody !== user.refreshToken) {
      return res.status(406).json({ msg: 'Invalid token refresh.' })
    }

    user.tokens = user.tokens.filter(token => token.token !== req.headers['x-access-token'])

    await user.save()

    const token = await user.generateAuthToken()

    const refreshToken = await user.generateRefreshToken()
    console.log(user)

    return res.status(201).json({
      token,
      refreshToken
    })

  } catch (error) {
    res.json(error)
  }
};