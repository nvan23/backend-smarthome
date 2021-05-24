const express = require('express')
const authentication = require('../../middleware/authentication')

const router = express.Router()

// get all members of the home
router.get('/', (__, res) => res.json({ msg: "get all members of the home" }))

// get a member of the home
router.get('/:id', (__, res) => res.json({ msg: "get a member of the home" }))

// block grantable of all members
router.patch('/block', (__, res) => res.json({ msg: "block grantable of all members at home" }))

// block grantable of a member
router.patch('/block/:id', (__, res) => res.json({ msg: "block grantable of a member at home" }))

// active grantable of a member
router.patch('/active/:id', (__, res) => res.json({ msg: "active grantable of a member" }))

module.exports = router