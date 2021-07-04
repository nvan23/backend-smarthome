const express = require('express')
const roomsRouter = require('./rooms')
const userController = require('../../controllers/user')
const requireAuthentication = require('../../middleware/requireAuthentication')

const router = express.Router()

// Register
router.post('/register', userController.register)

//Login a registered user
router.post('/login', userController.login)

// Log user out of the application
router.post('/me/logout', requireAuthentication, userController.logout)

// Log user out of all devices
router.post('/me/logout-all', requireAuthentication, userController.logoutAll)

// View logged in user profile
router.get('/me', requireAuthentication, userController.me)

// Forgot password
router.get('/forgot-password', userController.forgotPassword)

// Reset password
router.get('/reset-password/:token', userController.resetPassword)

// change password
router.patch('/reset-password/:token', userController.changePassword)

// Update profile user
router.put('/me', requireAuthentication, (__, res) => res.json({ msg: "Update profile user" }))

// Room
router.use('/me/rooms', requireAuthentication, roomsRouter)

module.exports = router