// models/BlacklistedUser.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blacklistedUserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Assuming each email can be blacklisted only once
  },
  reason: {
    type: String,
    required: true,
  },

  blacklisted: { type: Boolean, default: true },
  disqualifiedBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  langCode: { type: String, required: true, default: "en" },
});

module.exports = mongoose.model("BlacklistedUser", blacklistedUserSchema);
