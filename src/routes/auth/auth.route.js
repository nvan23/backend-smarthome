const express = require('express')
const authentication = require('../../middleware/authentication')

const router = express.Router()


// Refresh token
router.post('/refresh-token', (__, res) => res.json({ msg: "refresh token" }))

// Check token is valid
router.post('/token', (__, res) => res.json({ msg: "valid token" }))

// Check role is user
router.post('/user/token', (__, res) => res.json({ msg: "user role" }))

// Check role is host
router.post('/host/token', (__, res) => res.json({ msg: "host role" }))

// Check role is admin
router.post('/admin/token', (__, res) => res.json({ msg: "admin role" }))

module.exports = router