const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  type: { type: String, default: 'MANUAL' },
  projectName: String,
  clientName: String,
  note: String,
  auto: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);