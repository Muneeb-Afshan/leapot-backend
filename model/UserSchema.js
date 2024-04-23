const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstname: { type: String },
    lastname: { type: String },
    // username: { type: String },
    password: { type: String },
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
