const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  fileType: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  colors: [
    {
      hex: String,
      percentage: Number
    }
  ],
  tags: [String]
});

module.exports = mongoose.model('Asset', assetSchema);