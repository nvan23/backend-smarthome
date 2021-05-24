'use strict'

require('dotenv').config()
const config = require('../config')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const errorHandler = require('../middleware/error-handler')
const router = require('../routes')

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(helmet())

app.use('/api/v1', router)
app.use(errorHandler.handleNotFound)
app.use(errorHandler.handleError)
exports.start = () => {
  app.listen(config.port, (err) => {
    if (err) {
      console.log(`Error : ${err}`)
      process.exit(-1)
    }

    console.log(`${config.app} is running on ${config.port}`)
  })
}

exports.app = app
