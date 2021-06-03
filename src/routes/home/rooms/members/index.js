const express = require('express')
const router = express.Router()

const memberController = require('../../../../controllers/room/member')

// get all members of a room
router.get('/', memberController.getAllMembers)

// add an member to room
router.put('/', memberController.create)

// remove an member from room
router.delete('/:id', memberController.delete)

// remove all members from room
router.delete('/', memberController.deleteAllMembers)

// block grantable of a member of a room
router.patch('/block/:id', memberController.block(true))

// block grantable of all members of a room
router.patch('/block')

// active grantable of a member of a room
router.patch('/active/:id', memberController.block(false))

// active grantable of all members of a room
router.patch('/active', (__, res) => res.json({ msg: "active grantable of all members of a room" }))

module.exports = router