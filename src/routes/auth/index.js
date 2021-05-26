const express = require('express')
const router = express.Router()

const authController = require('../../controllers/auth')

// Refresh token
router.post('/token/refresh', authController.refreshToken)

module.exports = router