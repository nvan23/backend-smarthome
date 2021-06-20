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
  devices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device'
  }],
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isBlock: {
      type: Boolean,
      default: false
    }
  }],
}, { timestamps: true })

const Room = mongoose.model('Room', roomSchema)

module.exports = Room