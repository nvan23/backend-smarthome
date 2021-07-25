const express = require('express')

const cameraController = require('../../../controllers/camera')

const router = express.Router()

// Get all cameras
router.get('/', cameraController.getAllCameras)

// Get a camera
router.get('/:id', cameraController.getCamera)

module.exports = router