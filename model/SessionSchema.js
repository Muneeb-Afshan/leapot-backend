const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  qrCode: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);
