const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete');

const ticketSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  },
  status: {
    type: Boolean,
    default: true,
  },
  closedAt: {
    type: String,
    default: '',
  },
}, { timestamps: true })

// Add plugin to Schema to use soft delete
ticketSchema.plugin(
  mongooseDelete,
  { deletedAt: true },
  { deletedBy: true },
  { overrideMethods: true },
)

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket