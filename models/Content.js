const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const contentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  header: { type: String },
  title: { type: String },
  content: { type: String },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, schemaOptions);

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
