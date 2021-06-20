const express = require('express')

const deviceController = require('../../../../controllers/room/device')

const router = express.Router()

// get all device of a room
router.get('/', (__, res) => res.json({ msg: "get all device of rooms" }))

// add an device to room
router.put('/', (__, res) => res.json({ msg: "add device to room" }))

// remove an device from room
router.delete('/:id', (__, res) => res.json({ msg: "remove an device from room" }))

// remove all device from room
router.delete('/', (__, res) => res.json({ msg: "remove all device from room" }))

module.exports = router