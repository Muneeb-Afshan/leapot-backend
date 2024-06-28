const mongoose = require("mongoose");

const UserHistorySchema = new mongoose.Schema({
  SrNo: {
    type: Number,
    required: true,
  },
  SuccessfulRecords: {
    type: Number,
    required: true,
  },
  FailedRecords: {
    type: Number,
    required: true,
  },
  TotalRecords: {
    type: Number,
    required: true,
  },
  TimeofAction: {
    type: Date,
    default: Date.now,
  },
  SuccessFilePath: String,
  FailureFilePath: String,
});

module.exports = mongoose.model("UserHistory", UserHistorySchema);
