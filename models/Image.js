const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'},
};

const imageSchema = new mongoose.Schema({
  type: { type: String },
  filename: { type: String },
  mimetype: { type: String },
  destination: { type: String },
  path: { type: String },
  size: { type: Number },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, schemaOptions);

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;