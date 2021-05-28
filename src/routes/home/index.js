const express = require('express')
const roomsRouter = require('./rooms')
const sensorsRouter = require('./sensors.route')
const membersRouter = require('./members.route')
const router = express.Router()

const homeController = require('../../controllers/home')

// mount rooms paths
router.use('/rooms', roomsRouter)

// mount sensors paths
router.use('/:id/sensors', sensorsRouter)

// mount members paths
router.use('/:id/members', membersRouter)

// get home information
router.get('/', homeController.getHome)

// update information of home from host
router.put('/', homeController.update)

module.exports = router