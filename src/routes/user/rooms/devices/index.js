const express = require('express')
const router = express.Router()

const deviceController = require('../../../../controllers/user/room/device')

const requireInRoom = require('../../../../middleware/requireInRoom')

// get all device of a room
router.get('/', deviceController.getAllDevices)

// get all device of a room
router.get('/:id', deviceController.getDevice)

// turn on device of a room
router.patch('/:id/turn-on', requireInRoom(), deviceController.turnOn(true))

// turn off device of a room
router.patch('/:id/turn-off', requireInRoom(), deviceController.turnOn(false))

module.exports = router