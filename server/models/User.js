const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  language: {
    type: String,
    enum: ['tamil', 'english'],
    default: 'english'
  },
  blindMode: {
    type: Boolean,
    default: false
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  otp: String,
  otpExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
