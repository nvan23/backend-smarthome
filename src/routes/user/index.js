const express = require('express')

const devicesRouter = require('./devices')
const camerasRouter = require('./cameras')
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
router.post('/forgot-password', userController.forgotPassword)

// Reset password
router.get('/reset-password/:token', userController.resetPassword)

// change password
router.patch('/reset-password/:token', userController.changePassword)

// Update profile user
router.patch('/me', requireAuthentication, userController.update)

// Add a new email address
router.patch('/me/email/new', requireAuthentication, userController.addEmail)

// Add a new email address
router.patch('/email/new/:token', userController.confirmEmail)

// Update gmail address
router.patch('/me/email', requireAuthentication, userController.requestEmailChange)

// Get data to change email address
router.get('/email/:token', userController.getDataChangeEmail)

// Update gmail address
router.patch('/email/:token', userController.changeEmail)

// Devices
router.use('/me/devices', requireAuthentication, devicesRouter)

// Devices
router.use('/me/cameras', requireAuthentication, camerasRouter)

// Room
router.use('/me/rooms', requireAuthentication, roomsRouter)

module.exports = router