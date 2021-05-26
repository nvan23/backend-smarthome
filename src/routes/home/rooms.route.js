const express = require('express')

const roomController = require('../../controllers/room')

const router = express.Router()

// get all rooms
router.get('/', roomController.getAllRooms)

// get a room
router.get('/:id', (__, res) => res.json({ msg: "get a room" }))

// create a new room
router.post('/', roomController.create, roomController.autoRoomToHome)

// update information of a room
router.put('/:id', (__, res) => res.json({ msg: "update information of a room" }))

// block grantable of any room in home
router.patch('/block/:id', (__, res) => res.json({ msg: "block grantable of any room in home" }))

// active grantable of any room in home
router.patch('/active/:id', (__, res) => res.json({ msg: "active grantable of any room in home" }))

// remove a room
router.delete('/:id', (__, res) => res.json({ msg: "remove a room" }))

// remove all rooms
router.delete('/', roomController.deleteAllRooms)

// get all sensors of a room
router.get('/:id/sensors', (__, res) => res.json({ msg: "get all sensors of rooms" }))

// add an sensor to room
router.put('/:id/sensors', (__, res) => res.json({ msg: "add sensors to room" }))

// remove an sensor from room
router.delete('/:id/sensors/:id', (__, res) => res.json({ msg: "remove an sensor from room" }))

// remove all sensors from room
router.delete('/:id/sensors', (__, res) => res.json({ msg: "remove all sensors from room" }))

// get all members of a room
router.get('/:id/members', (__, res) => res.json({ msg: "get all members of rooms" }))

// add an member to room
router.put('/:id/members', (__, res) => res.json({ msg: "add member to room" }))

// remove an member from room
router.delete('/:id/members/:id', (__, res) => res.json({ msg: "remove an member from room" }))

// remove all members from room
router.delete('/:id/members', (__, res) => res.json({ msg: "remove all members from room" }))

module.exports = router