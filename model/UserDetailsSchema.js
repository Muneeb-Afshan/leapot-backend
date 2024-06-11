const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserDetailsSchema = new Schema({
  email: { type: String, required: true, unique: true },
  userid: { type: Schema.Types.ObjectId, ref:'User', unique: true }, // Corrected to ObjectId
  dateofbirth: { type: Date },
  bio: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  address1: { type: String },
  address2: { type: String },
  langCode:{type: String, required: true , default : "en"},

});

module.exports = mongoose.model('UserDetails', UserDetailsSchema);
