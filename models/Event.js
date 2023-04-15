const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'EventType' },
  quantity: { type: String, default: 0 },
  province: { type: Number, default: 75 },
  district: { type: Number },
  subdistrict: { type: Number },
  zipcode: { type: Number },
  budget: { type: Number, default: null },
  startdate: { type: Date, required: true },
  enddate: { type: Date, default: function() {
    var resDate = new Date(this.startdate);
    resDate.setDate(resDate.getDate() + (this.expectdate - 1));
    return resDate;
  }},
  expectdate: { type: Number },
  expectquantity: { type: String },
  researcher: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventResearcher' }],
  target: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventTarget' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, schemaOptions);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
