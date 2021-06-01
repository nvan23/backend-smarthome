const jwt = require('jsonwebtoken')

const User = require('../models/user.model')

const mockUserId = () => {
  return async function (req, res, next) {
    try {
      const tokenFromHeader = req?.headers['x-access-token']
      if (!tokenFromHeader) throw { error: 'No token provided' }

      const data = jwt.decode(tokenFromHeader)

      const user = await User
        .findOne({ _id: data.id, "tokens.token": tokenFromHeader })
        .select('id')

      if (!user) throw { error: "User not found" }
      req.userId = user.id
      next()
    } catch (error) {
      res.status(401).json(error)
    }
  }
}
module.exports = mockUserId
