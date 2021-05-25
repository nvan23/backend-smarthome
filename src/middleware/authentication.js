const config = require('../config')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const authentication = async (req, res, next) => {
  try {
    const tokenFromHeader = req?.headers['x-access-token'];
    if (!tokenFromHeader) throw { error: 'No token provided' }

    const data = jwt.verify(tokenFromHeader, config.secret, (err, decoded) => {
      if (err) throw { error: 'Token expired' }

      next()
    })

    const user = await User.findOne({ _id: data.id, "tokens.token": tokenFromHeader }).select('id')

    if (!user) throw { error: 'Not authenticated to access this resource' }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json(error)
  }

}
module.exports = authentication