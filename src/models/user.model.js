const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SALT_ROUNDS } = require('../constants/auth');
const config = require('../config')
const Role = require('./role.model');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
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
        throw new Error({ error: 'Invalid email address' })
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate: value => {
      if (!validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })) {
        throw new Error({ error: 'Password is no strong' })
      }
    }
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  }],
  isBlock: {
    type: Boolean,
    default: false,
  },
  tokens: [{
    token: {
      type: String,
    }
  }],
  refreshToken: {
    type: String,
    default: '',
  },
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    default: null,
  },
  currentHome: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    default: null,
  },
  rooms: [{
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    isBlock: {
      type: Boolean,
      default: false
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
  const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: config.token_life })
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.methods.generateRefreshToken = async function () {
  // Generate an auth token for the user
  const user = this
  const refreshToken = jwt.sign({}, config.secret)
  user.refreshToken = refreshToken
  await user.save()
  return refreshToken
}

userSchema.methods.initUserRole = async function () {
  // Generate an auth token for the user
  const user = this
  const role = await Role.findOne({ key: config.roles.user })
  if (role) {
    user.roles = user.roles.concat(role._id)
  }
  await user.save()
}

const User = mongoose.model('User', userSchema)

module.exports = User
