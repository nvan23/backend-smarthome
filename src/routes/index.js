'use strict'

const express = require('express')

const config = require('../config')

const requireAuthentication = require('../middleware/requireAuthentication')
const requireAuthorization = require('../middleware/requireAuthorization')

const mockUserId = require('../utils/mockUserId')

const router = express.Router()
const authRouter = require('./auth')
const userRouter = require('./user')
const usersRouter = require('./users')
const rolesRouter = require('./roles')
const homeRouter = require('./home')
const homesRouter = require('./homes')
const trashRouter = require('./trash.route')

router.use(
  '/auth',
  mockUserId(),
  authRouter
) // mount auth paths

router.use('/user', userRouter) // mount user paths

router.use(
  '/users',
  requireAuthentication,
  requireAuthorization(config.roles.admin),
  usersRouter
) // mount user paths

router.use(
  '/roles',
  requireAuthentication,
  requireAuthorization(config.roles.admin),
  rolesRouter
) // mount user paths

router.use(
  '/home',
  requireAuthentication,
  requireAuthorization(config.roles.host),
  homeRouter
) // mount home paths

router.use(
  '/homes',
  requireAuthentication,
  requireAuthorization(config.roles.admin),
  homesRouter
) // mount homes paths

router.use('/trash', trashRouter) // mount trash paths

module.exports = router