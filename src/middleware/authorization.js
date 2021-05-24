const { ROLES } = require('../constants/auth')

const User = require('../models/user.model')
const authorization = async (req, res, next) => {

      User.findById(req.user._id)
            .then(user => {
                  user.role === ROLES.admin
                        ? next()
                        : res.status(400).send({ error: 'Not authorized to access this resource' })
            })
            .catch(error => res.status(400).send(error))

}

module.exports = authorization