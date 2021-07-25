'use strict'

const app = require('./services/express')
const mongoose = require('./services/mongoose')
const initializer = require('./services/initializer')

const mqttHandler = require('./services/mqtt')
const mqttClient = new mqttHandler()

// start app and connect to database
app.start()
mongoose.connect()
initializer.roles()
initializer.host()

// handle mqtt
mqttClient.connect()
mqttClient.initSubscribe()
mqttClient.mqttListener()

module.exports = app
