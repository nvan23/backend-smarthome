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
const trashRouter = require('./trash')

const mqttHandler = require('../services/mqtt')
const mqttClient = new mqttHandler()
mqttClient.connect()

router.use(
  '/auth',
  mockUserId(),
  authRouter
) // mount auth paths

router.use('/user', userRouter) // mount user paths

router.use(
  '/users',
  requireAuthentication,
  requireAuthorization(config.roles.host),
  usersRouter
) // mount user paths

router.use(
  '/roles',
  requireAuthentication,
  rolesRouter
) // mount user paths

router.use(
  '/home',
  requireAuthentication,
  requireAuthorization(config.roles.host),
  homeRouter
) // mount home paths

router.use('/trash', trashRouter) // mount trash paths

router.post('/sub', function (req, res) {
  mqttClient.mqttListener()
  mqttClient.subscribe('topic-fire')
  res.status(200).json({ topic: "topic-fire" })
})

router.post('/pub', function (req, res) {
  mqttClient.publish('topic-fire', 'pub-topic-fire-1')
  res.status(200).json({ topic: "pub-topic-fire" })
})

module.exports = router