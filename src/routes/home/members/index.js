const express = require('express')
const memberController = require('../../../controllers/member')

const router = express.Router()

// get all members of the home
router.get('/', memberController.getAllMembers)

// get a member of the home
router.get('/:id', memberController.getMember)

// block grantable of all members of a home
router.patch('/block', (__, res) => res.json({ msg: "block grantable of all members at home" }))

// block grantable of a member of a home
router.patch('/block/:id', (__, res) => res.json({ msg: "block grantable of a member at home" }))

// active grantable of all members of a home
router.patch('/active', (__, res) => res.json({ msg: "active grantable of all members" }))

// active grantable of a member of a home
router.patch('/active/:id', (__, res) => res.json({ msg: "active grantable of a member" }))

module.exports = router