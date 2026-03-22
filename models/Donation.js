const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: String,
  donorEmail: String,
  amount: Number,
  currency: String,
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);