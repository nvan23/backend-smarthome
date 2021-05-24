const express = require('express')
const userController = require('../../controllers/user/user.controller')
const authentication = require('../../middleware/authentication')

const router = express.Router()

// Register
router.post('/register', userController.register)

//Login a registered user
router.post('/login', (__, res) => res.json({ msg: "Login" }))

// Log user out of the application
router.post('/me/logout', (__, res) => res.json({ msg: "Logout" }))

// Log user out of all devices
router.post('/me/logout-all', (__, res) => res.json({ msg: "logout all" }))

// View logged in user profile
router.get('/me', (__, res) => res.json({ msg: "View profile" }))

// Reset password
router.patch('/me/reset-password', (__, res) => res.json({ msg: "Reset password" }))

// Update profile user
router.put('/me', (__, res) => res.json({ msg: "Update profile user" }))

module.exports = router