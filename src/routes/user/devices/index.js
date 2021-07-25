const express = require('express')

const deviceController = require('../../../controllers/user/devices')

const router = express.Router()

// Get all devices
router.get('/', deviceController.getAllDevices)

module.exports = router