const express = require('express')

const router = express.Router()

// create a new devices
router.post('/', (__, res) => res.json({ msg: "create an new devices" }))

// get all devices of the home
router.get('/', (__, res) => res.json({ msg: "get all devices of the home" }))

// get a device
router.get('/:id', (__, res) => res.json({ msg: "get a device" }))

// update information of a device
router.put('/:id', (__, res) => res.json({ msg: "update information of a device" }))

// block grantable of all devices
router.patch('/block', (__, res) => res.json({ msg: "block grantable of all devices" }))

// block grantable of a device
router.patch('/block/:id', (__, res) => res.json({ msg: "block grantable of a device" }))

// active grantable of all devices
router.patch('/active', (__, res) => res.json({ msg: "active grantable of all devices" }))

// active grantable of a device
router.patch('/active/:id', (__, res) => res.json({ msg: "active grantable of a device" }))

// delete a device
router.delete('/:id', (__, res) => res.json({ msg: "delete a device" }))

// delete all devices
router.delete('/', (__, res) => res.json({ msg: "delete all devices" }))

module.exports = router