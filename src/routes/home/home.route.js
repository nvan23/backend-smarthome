const express = require('express')
const roomsRouter = require('./rooms.route')
const sensorsRouter = require('./sensors.route')
const membersRouter = require('./members.route')
const router = express.Router()

const userController = require('../../controllers/user.controller')
const authentication = require('../../middleware/authentication')
const authorization = require('../../middleware/authorization')

// mount rooms paths
router.use('/:id/rooms', roomsRouter)

// mount sensors paths
router.use('/:id/sensors', sensorsRouter)

// mount members paths
router.use('/:id/members', membersRouter)

// get home information
router.get('/', (__, res) => res.json({ msg: "get home information" }))

// update information of home from host
router.put('/', (__, res) => res.json({ msg: "update information of home from host" }))

module.exports = router