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
  DeleteNotificationSettings,
  UpdateNotificationSettings,
} = require("../controller/notification/NotificationController");
const verifyToken = require("../middleware/TokenVerifyMiddleware");

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
notificationRouter.get(
  "/notification/singlefetchnotifications/:id",
  singlefetchnotifications
);
notificationRouter.get("/notification/search", searchNotifications);
notificationRouter.post(
  "/notification/notificationsettings",
  createNotificationSettings
);
notificationRouter.get("/notification/fetchAllSettings", getAllNotifications);
notificationRouter.put(
  "/notification/notificationsettings/:id/toggle",
  toggleNotificationSettings
);
notificationRouter.put(
  "/notification/notificationsettings/:id",
  DeleteNotificationSettings
);
notificationRouter.put(
  "/notification/Updatenotificationsettings/:id",
  UpdateNotificationSettings
);

module.exports = notificationRouter;
