const express = require('express')
const router = express.Router()
const cameraController = require('../../../controllers/camera')

// create a new cameras
router.post('/', cameraController.create)

// get all cameras of the home
router.get('/', cameraController.getAllCameras)

// get a camera
router.get('/:id', cameraController.getCamera)

// update information of a camera
router.put('/:id', cameraController.update)

// block grantable of all cameras
router.patch('/block', cameraController.blockAllCameras(true))

// block grantable of a camera
router.patch('/block/:id', cameraController.block(true))

// active grantable of all cameras
router.patch('/active', cameraController.blockAllCameras(false))

// active grantable of a camera
router.patch('/active/:id', cameraController.block(false))

// delete a camera
router.delete('/:id', cameraController.delete)

// delete all cameras
router.delete('/', cameraController.deleteAllCameras)

module.exports = router