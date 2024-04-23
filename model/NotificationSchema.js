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
});

module.exports = {
  CreateNotification: mongoose.model(
    "CreateNotification",
    CreateNotificationSchema
  ),
};
