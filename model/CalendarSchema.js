const mongoose = require("mongoose");

//tags schema
const TagsSchema = new mongoose.Schema({
  tagsId: mongoose.Schema.Types.ObjectId,
  tagNo: {
    type: Number,
    required: true,
  },
  tags_name: {
    type: String,
    required: true,
  },
  langCode:{type: String, required: true , default : "en"},
});
//announcements details schema
const AnnouncementSchema = new mongoose.Schema({
  announcementNo: {
    type: Number,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  langCode:{type: String, required: true , default : "en"},
});

//add announcements schema
const AddAnnouncementSchema = new mongoose.Schema({
  announcementNo: {
    type: String,
    required: true,
    unique: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventEndDate: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  active: { type: Boolean, default: true },
  langCode:{type: String, required: true , default : "en"},
});

//user statistics schema
const UserStatsSchema = new mongoose.Schema({
  EventName: {
    type: String,
    required: true,
  },
  totalRegistrations: {
    type: Number,
    required: true,
  },
  activeRegistrations: {
    type: Number,
    required: true,
  },

  cancelRegistrations: {
    type: Number,
    required: true,
  },

  paymentPending: {
    type: Number,
    required: true,
  },
  langCode:{type: String, required: true , default : "en"},
});

//event enrolled users details
const EventEnrolledUsersSchema = new mongoose.Schema({
  EventName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    required: true,
    enum: ["Pending", "Completed", "Approved"],
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  langCode:{type: String, required: true , default : "en"},
});

//event users details
const EventUsersDetailsSchema = new mongoose.Schema({
  EventName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Inactive"],
  },
  langCode:{type: String, required: true , default : "en"},
});

module.exports = {
  TagsDetails: mongoose.model("TagsDetails", TagsSchema),
  Announcements: mongoose.model("Announcements", AnnouncementSchema),
  AddAnnouncements: mongoose.model("AddAnnouncements", AddAnnouncementSchema),
  UserStats: mongoose.model("UserStats", UserStatsSchema),
  EventEnrolledUsers: mongoose.model(
    "EventEnrolledUsers",
    EventEnrolledUsersSchema
  ),
  EventUsersDetails: mongoose.model(
    "EventUsersDetails",
    EventUsersDetailsSchema
  ),
};
