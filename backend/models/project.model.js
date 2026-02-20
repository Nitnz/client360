const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  startDate: Date,
  endDate: Date,
  domainName: String,
  domainExpiry: Date,
  hostingExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
