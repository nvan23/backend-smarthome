const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
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
  isBlock: {
    type: Boolean,
    default: false,
  },
  sensors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sensor'
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, { timestamps: true })

const Room = mongoose.model('Room', roomSchema)

module.exports = Room