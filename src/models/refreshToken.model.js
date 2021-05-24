const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete');

const refreshTokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  refreshToken: String
}, { timestamps: true })

// Add plugin to Schema to use soft delete
refreshTokenSchema.plugin(
  mongooseDelete,
  { deletedAt: true },
  { deletedBy: true },
  { overrideMethods: true },
)

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)

module.exports = RefreshToken