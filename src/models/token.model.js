const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  changed: {
    type: Boolean,
    required: true,
    default: false,
  }
}, { timestamps: true })

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token