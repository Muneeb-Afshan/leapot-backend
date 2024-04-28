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
  searchNotifications,
  createNotificationSettings,
  getNotificationsByRole,
  toggleNotificationSettings,
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
notificationRouter.get("/notifications/search", searchNotifications);
notificationRouter.post(
  "/notifications/notificationsettings",
  createNotificationSettings
);
notificationRouter.get("/notifications/:role", getNotificationsByRole);
notificationRouter.put(
  "/notifications/notificationsettings/:id/toggle",
  toggleNotificationSettings
);

module.exports = notificationRouter;
