const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Nested schema for learner-specific fields
const LearnerDetailsSchema = new Schema(
  {
    amountSpent: { type: Number, default: 0 },
    lastSignIn: { type: Date },
    referredBy: { type: String },
    signInCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstname: { type: String },
    lastname: { type: String },
    // username: { type: String },
    password: { type: String },
    countryCode: { type: Number },
    phoneNo: { type: Number },
    role: { type: String, required: true, default: "Learner" },
    token: { type: String },
    userStatus: { type: Boolean, default: true },
    email_verified: { type: Boolean, default: false },
    profile_complete: { type: Boolean, default: false },
    user_id: { type: String },
    picture: { type: String },
    deleteStatus: { type: Boolean, default: false },
    blacklisted: { type: Boolean, default: false },
    events: [{ type: String }],
    lastLogin: { type: Date, default: null },
    learnerDetails: { type: LearnerDetailsSchema, default: () => ({}) },
    langCode: { type: String, required: true, default: "en" },
    otp: { type: String },
    otpExpiration: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Define the virtual field for activeEnrollments
UserSchema.virtual("learnerDetails.activeEnrollments").get(function () {
  return this.events ? this.events.length : 0;
});

// Middleware to conditionally include learnerDetails only for "Learner" role
UserSchema.pre("save", function (next) {
  if (this.role !== "Learner") {
    this.learnerDetails = undefined;
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
