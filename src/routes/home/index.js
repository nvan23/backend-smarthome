const express = require('express')
const roomsRouter = require('./rooms')
const sensorsRouter = require('./sensors')
const membersRouter = require('./members')
const router = express.Router()

const homeController = require('../../controllers/home')

// mount rooms paths
router.use('/rooms', roomsRouter)

// mount sensors paths
router.use('/sensors', sensorsRouter)

// mount members paths
router.use('/members', membersRouter)

// get home information
router.get('/', homeController.getHome)

// update information of home from host
router.put('/', homeController.update)

module.exports = router