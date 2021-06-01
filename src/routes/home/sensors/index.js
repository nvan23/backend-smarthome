const express = require('express')
const requireAuthentication = require('../../../middleware/requireAuthentication')

const router = express.Router()

// create a new sensors
router.post('/', (__, res) => res.json({ msg: "create an new sensors" }))

// get all sensors of the home
router.get('/', (__, res) => res.json({ msg: "get all sensors of the home" }))

// get a sensor
router.get('/:id', (__, res) => res.json({ msg: "get a sensor" }))

// update information of a sensor
router.put('/:id', (__, res) => res.json({ msg: "update information of a sensor" }))

// block grantable of all sensors
router.patch('/block', (__, res) => res.json({ msg: "block grantable of all sensors" }))

// block grantable of a sensor
router.patch('/block/:id', (__, res) => res.json({ msg: "block grantable of a sensor" }))

// active grantable of all sensors
router.patch('/active', (__, res) => res.json({ msg: "active grantable of all sensors" }))

// active grantable of a sensor
router.patch('/active/:id', (__, res) => res.json({ msg: "active grantable of a sensor" }))

// delete a sensor
router.delete('/:id', (__, res) => res.json({ msg: "delete a sensor" }))

// delete all sensors
router.delete('/', (__, res) => res.json({ msg: "delete all sensors" }))

module.exports = router