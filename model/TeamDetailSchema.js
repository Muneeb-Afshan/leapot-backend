// models/Data.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  delete_flag: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('TeamDetails', dataSchema);
