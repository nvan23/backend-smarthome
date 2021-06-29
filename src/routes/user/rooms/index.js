const express = require('express')

const devicesRouter = require('../rooms/devices')
const membersRouter = require('../rooms/members')

const roomController = require('../../../controllers/user/room')
const mockRoomId = require('../../../utils/mockRoomId')

const router = express.Router()

// get all rooms
router.get('/', roomController.getAllRooms)

// get a room
router.get('/:id', roomController.getRoom)

// mount devices in room paths
router.use('/:id/devices', mockRoomId(), devicesRouter)

// mount members in room paths
router.use('/:id/members', mockRoomId(), membersRouter)

module.exports = router