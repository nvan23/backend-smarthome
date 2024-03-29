const express = require('express')
const router = express.Router()
const deviceController = require('../../../controllers/device')

// create a new devices
router.post('/', deviceController.create)

// get all devices of the home
router.get('/', deviceController.getAllDevices)

// get a device
router.get('/:id', deviceController.getDevice)

// update information of a device
router.put('/:id', deviceController.update)

// block grantable of all devices
router.patch('/block', deviceController.blockAllDevices(true))

// block grantable of a device
router.patch('/block/:id', deviceController.block(true))

// active grantable of all devices
router.patch('/active', deviceController.blockAllDevices(false))

// active grantable of a device
router.patch('/active/:id', deviceController.block(false))

// delete a device
router.delete('/:id', deviceController.delete)

// delete all devices
router.delete('/', deviceController.deleteAllDevices)

module.exports = router