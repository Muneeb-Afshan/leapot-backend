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
  singlefetchnotifications,
  searchNotifications,
  createNotificationSettings,
  getAllNotifications,
  toggleNotificationSettings,
} = require("../controller/notification/NotificationController");
const verifyToken = require('../middleware/TokenVerifyMiddleware');

notificationRouter.post("/notification/postnotification",verifyToken, createNotification);

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
notificationRouter.post("/notification/sendnotifications",verifyToken, sendNotifications);

notificationRouter.get("/notification/fetchnotifications", getNotifications);
notificationRouter.get("/notification/singlefetchnotifications/:id", singlefetchnotifications);
notificationRouter.get("/notification/search", searchNotifications);
notificationRouter.post(
  "/notification/notificationsettings",verifyToken,
  createNotificationSettings
);
notificationRouter.get("/notification/fetchAllSettings", getAllNotifications);
notificationRouter.put(
  "/notification/notificationsettings/:id/toggle",
  toggleNotificationSettings
);

module.exports = notificationRouter;
