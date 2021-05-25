'use strict'
const express = require('express')
const router = express.Router()
const authRouter = require('./auth')
const userRouter = require('./user')
const usersRouter = require('./users')
const rolesRouter = require('./roles')
const homeRouter = require('./home')
const homesRouter = require('./homes')
const trashRouter = require('./trash.route')

router.use('/auth', authRouter) // mount auth paths
router.use('/user', userRouter) // mount user paths
router.use('/users', usersRouter) // mount user paths
router.use('/roles', rolesRouter) // mount user paths
router.use('/home', homeRouter) // mount home paths
router.use('/homes', homesRouter) // mount homes paths
router.use('/trash', trashRouter) // mount trash paths

module.exports = router