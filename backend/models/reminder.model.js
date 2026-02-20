const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },

    type: {
      type: String,
      enum: ['domain', 'hosting', 'payment'],
      required: true
    },

    remindDate: {
      type: Date,
      required: true
    },

    message: {
      type: String
    },

    sent: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);
