'use strict'

const app = require('./services/express')
const mongoose = require('./services/mongoose')
const initializer = require('./services/initializer')

// start app and connect to database
app.start()
mongoose.connect()
initializer.roles()

module.exports = app
