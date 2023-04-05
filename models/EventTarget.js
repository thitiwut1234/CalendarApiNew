const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const eventTargetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receivedbudget: { type: Number, default: 0},
  expectdate: { type: Number, default: null },
  expectamount: { type: Number, default: null },
  expectincome: { type: Number, default: null },
  actualdate: { type: Number, default: null },
  actualamount: { type: Number, default: null },
  actualincome: { type: Number, default: null },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, schemaOptions);

const EventTarget = mongoose.model('EventTarget', eventTargetSchema);

module.exports = EventTarget;
