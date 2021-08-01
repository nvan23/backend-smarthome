const express = require('express')
const router = express.Router()

const deviceController = require('../../../../controllers/user/room/device')

const requireInRoom = require('../../../../middleware/requireInRoom')

// get all device of a room
router.get('/', deviceController.getAllDevices)

// get all devices of the home with type
router.get('/search/type/:type', deviceController.getAllDevicesWithType)

// get all device of a room
router.get('/:id', deviceController.getDevice)

// enable auto run of a device on a room
router.patch('/:id/auto-run/enable', requireInRoom(), deviceController.autoRun(true))

// disable auto run of a device on a room
router.patch('/:id/auto-run/disable', requireInRoom(), deviceController.autoRun(false))

// turn on device of a room
router.patch('/:id/turn-on', requireInRoom(), deviceController.turnOn(true))

// turn off device of a room
router.patch('/:id/turn-off', requireInRoom(), deviceController.turnOn(false))

module.exports = router