const mongoose = require("mongoose");

const LearnerToCourseRegistration = new mongoose.Schema({
  email: { type: String },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // This field should be a reference to the User model.
  eventid: { type: mongoose.Schema.Types.ObjectId, ref: "events" }, // This field should be a reference to the Event model.
  eventname: { type: String }, // Changed from ObjectId to String
  firstname: { type: String }, // Changed from ObjectId to String
  lastname: { type: String }, // Changed from ObjectId to String
  courseid: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  registrationDate: { type: Date, required: true },
  cancelled: { type: Boolean, default: false },
  cancellationDate: Date,
  cancellationReason: { type: mongoose.Schema.Types.ObjectId, required: false }, // This field may not be required if a registration is not cancelled.
  registrationStatus: { type: Boolean, required: true },
  paymentid: { type: mongoose.Schema.Types.ObjectId, required: false }, // This field should be a reference to the Payment model.
  langCode: { type: String, required: true, default: "en" },
});

module.exports = mongoose.model("Registration", LearnerToCourseRegistration);
