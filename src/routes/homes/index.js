const express = require('express')
const userController = require('../../controllers/user/user.controller')
const authentication = require('../../middleware/authentication')
const authorization = require('../../middleware/authorization')

const router = express.Router()

// create an new home from admin
router.post('/', (__, res) => res.json({ msg: "create an new home from admin" }))

// get an all homes
router.get('/', (__, res) => res.json({ msg: "get an all homes" }))

// get an home
router.get('/:id', (__, res) => res.json({ msg: "get an home" }))

// block access of home
router.patch('/block/:id', (__, res) => res.json({ msg: "block access of home" }))

// active access of home
router.patch('/active/:id', (__, res) => res.json({ msg: "active access of home" }))

// update home information
router.put('/:id', (__, res) => res.json({ msg: "update home information" }))

// block user
router.delete('/:id', (__, res) => res.json({ msg: "delete user" }))

module.exports = router