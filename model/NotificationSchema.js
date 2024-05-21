const mongoose = require("mongoose");

//create notification schema
const CreateNotificationSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: [
      "SuperAdmin",
      "Admin",
      "Learner",
      "Instructor",
      "Course Reviewer",
      "Course Developer",
      "Select All",
    ],
    required: true,
  },
  notificationType: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  notificationBody: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isDeleted: { type: Boolean, default: false },
  langCode:{type: String, required: true , default : "en"},
});

// Method to fetch unique notification types

//as we know in the schema IndividualNotificationSchema the "email_Type" will get its values that are entered in  "notificationType" from the notifications schema
CreateNotificationSchema.statics.getNotificationTypes = async function () {
  const types = await this.distinct("notificationType").exec();
  return types;
};

//create send to individual notification schema
const SendNotificationSchema = new mongoose.Schema({
  email_Type: {
    type: String,
    required: true,
  },
  user_recipients: {
    type: [String], // Array type for multiple recipients
    required: true,
    validate: {
      validator: function (value) {
        return value.every((email) => validateEmail(email));
      },
      message: "Invalid email address",
    },
  },
  cc: { type: String },
  bcc: { type: String },
  email_Subject: {
    type: String,
    required: true,
  },
  email_Body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  langCode:{type: String, required: true , default : "en"},
});

// Custom email validation function
const validateEmail = (email) => {
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email against the regex
  return emailRegex.test(String(email).toLowerCase());
};

//create send to individual notification schema
// const NotificationSettingsSchema = new mongoose.Schema({
//   settingsName: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   roles: {
//     type: [String],
//     enum: [
//       "Admin",
//       "Learner",
//       "Instructor",
//       "Course Reviewer",
//       "Course Developer",
//       "Select All",
//     ],
//     required: true,
//   },

//   isEnabled: {
//     type: Boolean,
//     default: false,
//   },
// });
const NotificationSettingsSchema = new mongoose.Schema({
  settingsName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  roles: {
    type: [
      {
        role: {
          type: String,
          enum: [
            "SuperAdmin",
            "Admin",
            "Learner",
            "Instructor",
            "Course Reviewer",
            "Course Developer",
            "Select All",
          ],
        },
        isEnabled: {
          type: Boolean,
          default: false,
        },
      },
    ],
    required: true,
  },
  langCode:{type: String, required: true , default : "en"},
});
module.exports = {
  CreateNotification: mongoose.model(
    "CreateNotification",
    CreateNotificationSchema
  ),
  SendNotification: mongoose.model("SendNotification", SendNotificationSchema),
  NotificationSettings: mongoose.model(
    "NotificationSettings",
    NotificationSettingsSchema
  ),
};
