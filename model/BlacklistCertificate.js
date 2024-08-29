const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blacklistedCertificateSchema = new Schema({
  certificateId: {
    type: Schema.Types.ObjectId,
    ref: "IssueCertificate", // Assuming you have a Certificate model
    required: false, // Set required to false as it's not always needed
  },
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
