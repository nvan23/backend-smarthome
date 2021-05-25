'use strict'

const config = require('../config')
const Role = require('../models/role.model')

exports.roles = async (req, res) => {
  const roles = await Role.find()

  if (roles.length) return

  const rawRoles = config.roles
  for (const [key, value] of Object.entries(rawRoles)) {
    const role = new Role({ name: key, key: value })
    await role.save()
  }
}