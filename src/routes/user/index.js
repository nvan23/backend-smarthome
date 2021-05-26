const express = require('express')
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

// Reset password
router.patch('/me/password/reset', (__, res) => res.json({ msg: "Reset password" }))

// Update profile user
router.put('/me', requireAuthentication, (__, res) => res.json({ msg: "Update profile user" }))

module.exports = router