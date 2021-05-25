const express = require('express')
const usersController = require('../../controllers/users/users.controller')
const authentication = require('../../middleware/authentication')
const authorization = require('../../middleware/authorization')

const router = express.Router()

// get all users
router.get('/', authorization, usersController.getAllUsers)

// get an user
router.get('/:id', usersController.getUser)

// change role of an user
router.patch('/:id/role/change', usersController.changeRole)

// change role of an user into user role
router.patch('/:id/role/reset', usersController.resetRole)

// update all roles of all users
router.patch('/roles/update-all', usersController.updateAllRolesOfAllUsers)

// block user
router.patch('/block/:id', usersController.block)

// active user
router.patch('/active/:id', usersController.active)

// delete an user
router.delete('/:id', usersController.delete)

// delete all users
router.delete('/', usersController.deleteAllUsers)

module.exports = router