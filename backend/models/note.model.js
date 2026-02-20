const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
{
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },

  noteText: {
    type: String,
    required: true,
    trim: true
  }

},
{ timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
