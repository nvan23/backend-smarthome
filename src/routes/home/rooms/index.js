const express = require('express')

const devicesRouter = require('../rooms/devices')
const membersRouter = require('../rooms/members')

const roomController = require('../../../controllers/room')

const mockRoomId = require('../../../utils/mockRoomId')

const router = express.Router()

// get all rooms
router.get('/', roomController.getAllRooms)

// get a room
router.get('/:id', roomController.getRoom)

// create a new room
router.post('/', roomController.create)

// update information of a room
router.put('/:id', roomController.update)

// block grantable of any room in home
router.patch('/block/:id', roomController.block(true))

// active grantable of any room in home
router.patch('/active/:id', roomController.block(false))

// remove a room
router.delete('/:id', roomController.delete)

// remove all rooms
router.delete('/', roomController.deleteAllRooms)

// mount devices in room paths
router.use('/:id/devices', devicesRouter)

// mount members in room paths
router.use('/:id/members', mockRoomId(), membersRouter)

module.exports = router