const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const eventResearcherSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, schemaOptions);

const EventResearcher = mongoose.model('EventResearcher', eventResearcherSchema);

module.exports = EventResearcher;
