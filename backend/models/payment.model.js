const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,  // ← comma was missing here
    index: true
  },

  amount: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ['Advance', 'Milestone', 'Final'],
    default: 'Advance'
  },

  method: {
    type: String,
    default: 'UPI'
  },

  note: String

}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);