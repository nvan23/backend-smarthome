const express = require('express')
const router = express.Router()

const usersController = require('../../controllers/users')

// get all users
router.get('/', usersController.getAllUsers)

// get an user
router.get('/:id', usersController.getUser)

// create new an user
router.post('/', usersController.create)

// change role of an user
router.patch('/:id/role/change', usersController.changeRole)

// reset role of an user
router.patch('/:id/role/reset', usersController.resetRole)

// reset home of an user
router.patch('/:id/home/reset', usersController.resetHome)

// update all roles of all users
router.patch('/roles/update-all', usersController.updateAllRolesOfAllUsers)

// block user
router.patch('/block/:id', usersController.block(true))

// active user
router.patch('/active/:id', usersController.block(false))

// delete an user
router.delete('/:id', usersController.delete)

// delete all users
router.delete('/', usersController.deleteAllUsers)

module.exports = router