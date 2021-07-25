const express = require('express')

const deviceController = require('../../../../controllers/room/device')

const router = express.Router()

// get all device of a room
router.get('/', deviceController.getAllDevices)

// add an device to room
router.put('/', deviceController.addDevice)

// remove an device from room
router.delete('/:id', deviceController.removeDevice)

// remove all device from room
router.delete('/', deviceController.removeAllDevices)

// turn on device of a room
router.patch('/:id/turn-on', deviceController.turnOn(true))

// turn off device of a room
router.patch('/:id/turn-off', deviceController.turnOn(false))

module.exports = router