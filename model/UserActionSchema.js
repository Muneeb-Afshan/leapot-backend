const mongoose = require("mongoose");

const UserActionSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  action: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
  actionTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserAction", UserActionSchema);
