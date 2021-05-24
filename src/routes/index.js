'use strict'
const express = require('express')
const router = express.Router()
const authRouter = require('./auth/auth.route')
const userRouter = require('./user/user.route')
const usersRouter = require('./users/users.route')
const homeRouter = require('./home/home.route')
const homesRouter = require('./homes/homes.route')
const trashRouter = require('./trash.route')

router.use('/auth', authRouter) // mount auth paths
router.use('/user', userRouter) // mount user paths
router.use('/users', usersRouter) // mount user paths
router.use('/home', homeRouter) // mount home paths
router.use('/homes', homesRouter) // mount homes paths
router.use('/trash', trashRouter) // mount trash paths

module.exports = router