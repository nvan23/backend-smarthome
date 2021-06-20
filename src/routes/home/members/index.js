const express = require('express')
const memberController = require('../../../controllers/member')

const router = express.Router()

// get all members of the home
router.get('/', memberController.getAllMembers)

// get a member of the home
router.get('/:id', memberController.getMember)

// block grantable of all members of a home
router.patch('/block', memberController.blockAllMembers(true))

// active grantable of all members of a home
router.patch('/active', memberController.blockAllMembers(false))

module.exports = router