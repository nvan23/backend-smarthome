const mongoose = require('mongoose')

const roleSchema = mongoose.Schema({
  name: String,
}, { timestamps: true })

const Role = mongoose.model('', roleSchema)

module.exports = Role