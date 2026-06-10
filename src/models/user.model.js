const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
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
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshToken: {
    type: String,
    select: false 
  }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  try {
    this.password = await argon2.hash(this.password);
  } catch (err) {
    throw err;
  }
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await argon2.verify(userPassword, candidatePassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;