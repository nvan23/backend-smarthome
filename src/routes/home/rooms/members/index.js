const express = require('express')

const memberController = require('../../../../controllers/room/member')

const router = express.Router()

// get all members of a room
router.get('/', (__, res) => res.json({ msg: "get all members of rooms" }))

// add an member to room
router.put('/', (__, res) => res.json({ msg: "add member to room" }))

// remove an member from room
router.delete('/:id', (__, res) => res.json({ msg: "remove an member from room" }))

// remove all members from room
router.delete('/', (__, res) => res.json({ msg: "remove all members from room" }))

module.exports = router