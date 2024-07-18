const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  qrCode: { type: String, required: true },
  generatedAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('QRCode', qrCodeSchema);
