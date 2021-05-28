const config = require('../config')

const Role = require('../models/role.model')
const User = require('../models/user.model')

const requireAuthorization = (role) => {
  return async function (req, res, next) {
    try {
      const user = await User.findById(req.user.id)
      if (!user) throw { error: "Cannot found user" }

      if (!user.roles.length) throw { error: "Account was banned" }


      const expectedRoleId = await Role.findOne({ key: role }).select('_id')

      const roleScanner = user.roles.includes(expectedRoleId?._id.toString())

      if (!roleScanner) throw { error: "Not authorized to access this resource" }

      if (role === config.roles.host) {
        if (!user.homeId) throw { error: "Home not found" }

        const home = { id: user.homeId }
        req.home = home
      }

      next()
    } catch (error) {
      res.status(401).json(error)
    }
  }
}
module.exports = requireAuthorization
