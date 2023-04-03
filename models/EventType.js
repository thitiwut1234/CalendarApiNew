const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const eventTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startdate: { type: Date },
  enddate: { type: Date },
  colorEvent: { type: String, default: '#7FB111' },
  color: { type: String, default: '#FFFFFF' },
  padding: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, schemaOptions);

const EventType = mongoose.model('EventType', eventTypeSchema);

module.exports = EventType;
