const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const eventActivitySchema = new mongoose.Schema({
  eventtarget: { type: mongoose.Schema.Types.ObjectId, ref: 'EventTarget' },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  detail: { type: String },
  budget: { type: Number },
  startdate: { type: Date },
  enddate: { type: Date },
  note: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, schemaOptions);

const EventActivity = mongoose.model('EventActivity', eventActivitySchema);

module.exports = EventActivity;
