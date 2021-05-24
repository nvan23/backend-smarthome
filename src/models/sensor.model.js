const mongoose = require('mongoose')

const sensorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    default: null
  },
  description: {
    type: String,
    required: true,
    lowercase: true,
  },
  isBlock: {
    type: Boolean,
    default: false,
  },
  isLive: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

const Sensor = mongoose.model('Sensor', sensorSchema)

module.exports = Sensor