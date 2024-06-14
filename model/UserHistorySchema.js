const mongoose = require("mongoose");

const UserHistorySchema = new mongoose.Schema({
  SrNo: {
    type: Number,
    required: true,
  },
  // userid: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  SuccessfulRecords: {
    type: Number,
    required: true,
  },
  FailedRecords: {
    type: Number,
    required: true,
  },
  TimeofAction: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserHistory", UserHistorySchema);
