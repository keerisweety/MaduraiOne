const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  busNumber: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  qrData: {
    type: String,
    required: true
  },
  paymentId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'used', 'expired'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
