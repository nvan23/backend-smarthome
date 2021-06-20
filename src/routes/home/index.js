const express = require('express')
const roomsRouter = require('./rooms')
const devicesRouter = require('./devices')
const membersRouter = require('./members')
const router = express.Router()

const homeController = require('../../controllers/home')

// mount rooms paths
router.use('/rooms', roomsRouter)

// mount devices paths
router.use('/devices', devicesRouter)

// mount members paths
router.use('/members', membersRouter)

// get home information
router.get('/', homeController.getHome)

// update information of home from host
router.put('/', homeController.update)

module.exports = router