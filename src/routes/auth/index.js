const express = require('express')
const router = express.Router()

const authController = require('../../controllers/auth')

// Refresh token
router.put('/token/refresh', authController.refreshToken)

module.exports = router