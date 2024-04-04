// models/BlacklistedUser.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blacklistedUserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true // Assuming each email can be blacklisted only once
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    // enum: ['Active', 'Inactive', 'Invalid' , 'Email Changed' , 'Deactivate'] // Adjust as needed
  },
  blacklisted: { type: Boolean, default: false } 
,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BlacklistedUser', blacklistedUserSchema);
