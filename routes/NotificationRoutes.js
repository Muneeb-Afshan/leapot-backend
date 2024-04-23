const express = require("express");
const notificationRouter = express.Router();
const {
  createNotification,
} = require("../controller/notification/NotificationController");

notificationRouter.post("/notification/postnotification", createNotification);

module.exports = notificationRouter;
