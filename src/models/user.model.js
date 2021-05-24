const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SALT_ROUNDS } = require('../constants/auth');

const userSchema = mongoose.Schema({
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
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: 'Invalid Email address' })
      }
    }
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

// Add plugin to Schema to use soft delete
userSchema.plugin(
  mongooseDelete,
  { deletedAt: true },
  { deletedBy: true },
  { overrideMethods: true },
)

userSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
  }
  next()
})

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this
  const token = jwt.sign({ id: user._id }, process.env.APP_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE || '10h' })
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.methods.generateRefreshToken = async function () {
  // Generate an auth token for the user
  const user = this
  const refreshToken = jwt.sign({}, process.env.APP_SECRET_REFRESH)
  user.refreshToken = refreshToken
  await user.save()
  return refreshToken
}

const User = mongoose.model('User', userSchema)

module.exports = User