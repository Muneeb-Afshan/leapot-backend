const express = require("express");
const notificationRouter = express.Router();
const {
  createNotification,
  fetchNotification,
} = require("../controller/notification/NotificationController");

notificationRouter.post("/notification/postnotification", createNotification);
notificationRouter.get("/notification/getnotifications", fetchNotification);

module.exports = notificationRouter;
