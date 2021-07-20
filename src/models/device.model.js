const mongoose = require('mongoose')

const deviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  description: {
    type: String,
    max: 500,
  },
  isBlock: {
    type: Boolean,
    default: false,
  },
  isLive: {
    type: Boolean,
    default: false,
  },
  hasData: {
    type: Boolean,
    default: false,
  },
  data: [],
}, { timestamps: true })

const Device = mongoose.model('Device', deviceSchema)

module.exports = Device