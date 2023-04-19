const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const eventOtherListSchema = new mongoose.Schema({
  list: { type: String, default: ""},
  amount: { type: Number, default: null },
  unit: { type: String, default: "" },
  costPerAmount: { type: Number, default: null },
  totalCost: { type: Number, default: null },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, schemaOptions);

const EventOtherList = mongoose.model('EventOtherList', eventOtherListSchema);

module.exports = EventOtherList;
