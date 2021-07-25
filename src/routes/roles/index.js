const express = require('express')

const config = require('../../config')

const rolesController = require('../../controllers/roles')
const requireAuthentication = require('../../middleware/requireAuthentication')
const requireAuthorization = require('../../middleware/requireAuthorization')

const router = express.Router()

// get all roles
router.get(
  '/',
  requireAuthorization(config.roles.host),
  rolesController.getAllRoles
)

// get an role
router.get(
  '/:id',
  rolesController.getRole
)

// create an role
router.post(
  '/',
  requireAuthorization(config.roles.host),
  rolesController.create
)

// update an role
router.put(
  '/:id',
  requireAuthorization(config.roles.host),
  rolesController.update
)

// delete a role
router.delete(
  '/:id',
  requireAuthorization(config.roles.host),
  rolesController.delete
)

// delete all roles
router.delete(
  '/',
  requireAuthorization(config.roles.host),
  rolesController.deleteAllRoles
)

module.exports = router