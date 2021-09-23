const { Timestamp } = require('bson')
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
    ref: 'Room',
    default: null
  },
  type: {
    type: String,
    required: true,
    trim: true,
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
  data: [{
    value: Number,
    createdAt: Date
  }],
  latestGasWarnedAt: [],
  latestTemperatureWarnedAt: [],
  autoRunStatus: {
    type: Boolean,
    default: false,
  },
  autoRun: {
    baseOn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      default: null
    },
    status: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true })

const Device = mongoose.model('Device', deviceSchema)

module.exports = Device