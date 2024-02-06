const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserDetailsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userid: { type: Schema.Types.ObjectId, required: true, unique: true }, // Corrected to ObjectId
  dateofbirth: { type: Date },
  bio: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  address: { type: String },
});

module.exports = mongoose.Model('UserDetails', UserDetailsSchema);
