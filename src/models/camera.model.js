const mongoose = require('mongoose')

const cameraSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ip: {
    type: String,
    required: true,
    trim: true,
  },
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
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
}, { timestamps: true })

const Camera = mongoose.model('Camera', cameraSchema)

module.exports = Camera