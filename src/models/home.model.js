const mongoose = require('mongoose')

const homeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
  description: {
    type: String,
    lowercase: true,
  },
  isBlock: {
    type: Boolean,
    default: false,
  },
  rooms: [{
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    isBlock: {
      type: Boolean,
      default: false
    }
  }],
  devices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device'
  }],
  cameras: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device'
  }]
}, { timestamps: true })

const Home = mongoose.model('Home', homeSchema)

module.exports = Home