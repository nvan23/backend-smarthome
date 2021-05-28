const express = require('express')

const sensorController = require('../../../../controllers/room/sensor')

const router = express.Router()

// get all sensors of a room
router.get('/', (__, res) => res.json({ msg: "get all sensors of rooms" }))

// add an sensor to room
router.put('/', (__, res) => res.json({ msg: "add sensors to room" }))

// remove an sensor from room
router.delete('/:id', (__, res) => res.json({ msg: "remove an sensor from room" }))

// remove all sensors from room
router.delete('/', (__, res) => res.json({ msg: "remove all sensors from room" }))

module.exports = router