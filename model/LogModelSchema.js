// logModel.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  method: String,
  url: String,
  status: Number,
  responseBody: Object // Store response body as an object
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
