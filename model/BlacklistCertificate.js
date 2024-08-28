// models/BlacklistedCertificate.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blacklistedCertificateSchema = new Schema({
  certificateId: {}, // Make sure to set required to false if not always required
  email: {
    type: String,
    required: true,
  },
  eventname: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  disqualifiedBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  langCode: {
    type: String,
    required: true,
    default: "en",
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event", // Assuming you have an Event model
    required: true,
  },
});

module.exports = mongoose.model(
  "BlacklistedCertificate",
  blacklistedCertificateSchema
);
