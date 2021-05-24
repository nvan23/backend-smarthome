const express = require('express')
const userController = require('../../controllers/user.controller')
const authentication = require('../../middleware/authentication')
const authorization = require('../../middleware/authorization')

const router = express.Router()

// get all users
router.get('/', (__, res) => res.json({ msg: "get all users" }))

// get an user
router.get('/:id', (__, res) => res.json({ msg: "get an user" }))

// block user
router.patch('/block/:id', (__, res) => res.json({ msg: "block user" }))

// active user
router.patch('/active/:id', (__, res) => res.json({ msg: "active user" }))

// block user
router.delete('/:id', (__, res) => res.json({ msg: "delete user" }))

module.exports = router