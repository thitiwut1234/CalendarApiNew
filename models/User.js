const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const userSchema = new mongoose.Schema({
  email: { type: String },
  idnumber: { type: String, required: function () { return !this.email } },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  birthdate: { type: Date, required: true },
  address: { type: String, required: true },
  province: { type: Number, required: true, default: 75 },
  district: { type: Number, required: true },
  subdistrict: { type: Number, required: true },
  zipcode: { type: Number, required: true },
  role: { type: String, default: 'user' },
  position: { type: String, default: '' },
  affiliation: { type: String, default: '' },
  agency: { type: String, default: '' },
  tel: { type: String, default: '' },
  lat: { type: String, default: '' },
  long: { type: String, default: '' },
  rank: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, schemaOptions);

const User = mongoose.model('User', userSchema);

module.exports = User;