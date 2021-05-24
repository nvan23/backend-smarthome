const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const authentication = async (req, res, next) => {
  // Retrieve the access token from the header
  const tokenFromHeader = req.headers['x-access-token'];
  if (!tokenFromHeader) {
    return res.status(403).json({ msg: 'No token provided.' });
  }

  try {
    // verifies secret and checks exp
    const data = jwt.verify(tokenFromHeader, process.env.APP_SECRET)
    const user = await User.findOne({ _id: data.id, "tokens.token": tokenFromHeader }).select('id')

    if (!user) {
      throw new Error()
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Not authenticated to access this resource' })
  }

}
module.exports = authentication