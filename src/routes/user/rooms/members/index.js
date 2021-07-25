const express = require('express')
const router = express.Router()

const memberController = require('../../../../controllers/user/room/member')

// get all members of a room
router.get('/', memberController.getAllMembers)

module.exports = router