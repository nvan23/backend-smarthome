const mongoose = require('mongoose')
const validator = require('validator')

const roleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  key: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  }
}, { timestamps: true })

const Role = mongoose.model('Role', roleSchema)

module.exports = Role