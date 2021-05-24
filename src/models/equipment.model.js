const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete');

const equipmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['laptop', 'pc'],
    default: 'laptop',
    required: true
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  },
  description: {
    type: String,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, { timestamps: true })

// Add plugin to Schema to use soft delete
equipmentSchema.plugin(
  mongooseDelete,
  { deletedAt: true },
  { deletedBy: true },
  { overrideMethods: true },
)

// init empty employee for new equipment
equipmentSchema.methods.initEmployees = async function () {
  const equipment = this
  equipment.users = []
  await equipment.save()
}

const Equipment = mongoose.model('Equipment', equipmentSchema)

module.exports = Equipment