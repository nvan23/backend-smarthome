'use strict'

const User = require("../../models/user.model");

exports.refreshToken = async (req, res) => {
  try {
    const refreshTokenFromBody = req.body.refreshToken
    if (!req.body || !refreshTokenFromBody)
      throw { error: 'Cannot found refresh token' }

    const user = await User.findById(req.userId)

    if (refreshTokenFromBody !== user.refreshToken)
      throw { error: 'Invalid token refresh' }

    const indexOfToken = user.tokens.indexOf(req?.headers['x-access-token'])

    if (indexOfToken) user.tokens.splice(indexOfToken, 1)

    await user.save()

    const token = await user.generateAuthToken()
    const refreshToken = await user.generateRefreshToken()

    return res.status(201).json({
      token,
      refreshToken
    })

  } catch (error) {
    res.status(400).json(error)
  }
};