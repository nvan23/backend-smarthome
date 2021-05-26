const config = require('../config')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const requireAuthentication = (req, res, next) => {
  try {
    const tokenFromHeader = req?.headers['x-access-token'];
    if (!tokenFromHeader) throw { error: 'No token provided' }

    jwt.verify(tokenFromHeader, config.secret, async (err, decoded) => {
      try {
        if (err) throw { error: 'Token expired' }

        const user = await User.findOne({ _id: decoded.id, "tokens.token": tokenFromHeader }).select('id')
        if (!user) throw { error: 'Not authenticated to access this resource' }

        req.user = user
        next()
      } catch (error) {
        res.status(400).json(error)
      }
    })

  } catch (error) {
    res.status(401).json(error)
  }

}
module.exports = requireAuthentication
