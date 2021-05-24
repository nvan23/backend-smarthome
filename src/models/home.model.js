const mongoose = require('mongoose')

const homeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true
  },
  equipments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  }],
  refreshToken: {
    type: String,
    default: '',
  },
  tokens: [{
    token: {
      type: String,
    }
  }]
}, { timestamps: true })

const Home = mongoose.model('Home', homeSchema)

module.exports = Home