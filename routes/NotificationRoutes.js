const express = require("express");
const notificationRouter = express.Router();
const {
  createNotification,
  fetchNotification,
  updateNotification,
  fetchSingleNotification,
  logicalDeleteNotification,
  sendNotifications,
  getNotifications,
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
notificationRouter.put(
  "/notification/deleteNotification/:id",
  logicalDeleteNotification
);
notificationRouter.post("/notification/sendnotifications", sendNotifications);
notificationRouter.get("/notification/fetchnotifications", getNotifications);

module.exports = notificationRouter;
