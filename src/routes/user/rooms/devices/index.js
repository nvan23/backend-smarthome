const express = require('express')

const deviceController = require('../../../../controllers/user/room/device')

const router = express.Router()

// get all device of a room
router.get('/', deviceController.getAllDevices)

// get all device of a room
router.get('/:id', deviceController.getDevice)

// turn on device of a room
router.patch('/:id', deviceController.turnOn(true))

// turn off device of a room
router.patch('/:id', deviceController.turnOn(false))

module.exports = router