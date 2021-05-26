const express = require('express')
const rolesController = require('../../controllers/roles')
const requireAuthentication = require('../../middleware/requireAuthentication')
const requireAuthorization = require('../../middleware/requireAuthorization')

const router = express.Router()

// get all roles
router.get('/', rolesController.getAllRoles)

// get an role
router.get('/:id', rolesController.getRole)

// create an role
router.post('/', rolesController.create)

// update an role
router.put('/:id', rolesController.update)

// delete a role
router.delete('/:id', rolesController.delete)

// delete all roles
router.delete('/', rolesController.deleteAllRoles)

module.exports = router