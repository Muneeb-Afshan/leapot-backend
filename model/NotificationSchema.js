const mongoose = require("mongoose");

//create notification schema
const CreateNotificationSchema = new mongoose.Schema({
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
});

// Custom email validation function
const validateEmail = (email) => {
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email against the regex
  return emailRegex.test(String(email).toLowerCase());
};

module.exports = {
  CreateNotification: mongoose.model(
    "CreateNotification",
    CreateNotificationSchema
  ),
  SendNotification: mongoose.model("SendNotification", SendNotificationSchema),
};
