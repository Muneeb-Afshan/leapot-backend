const express = require("express");
const notificationRouter = express.Router();
const {
  createNotification,
  fetchNotification,
  updateNotification,
  fetchSingleNotification,
} = require("../controller/notification/NotificationController");

notificationRouter.post("/notification/postnotification", createNotification);
notificationRouter.get("/notification/getnotifications", fetchNotification);
notificationRouter.get(
  "/notification/getSingleNotification/:id",
  fetchSingleNotification
);

notificationRouter.put(
  "/notification/editnotification/:id",
  updateNotification
);

module.exports = notificationRouter;
