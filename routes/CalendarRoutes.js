const express = require("express");
const calendarRouter = express.Router();
const {
  putAllTags,
  getAllTags,
  getAllEvents,
  getEventByStartDate,
  getEventDetails,
  getannouncementDetails,
  getUserStatistics,
  getEnrolledUsersDetails,
  getUserDetails,
  putUserStatistics,
  putEnrolledUsersDetails,
  addAnnouncements,
  getAnnouncementInfo,
  putUserDetails,
} = require("../controller/calendar/CalendarDetailsController");

calendarRouter.post("/calendar/postTags", putAllTags);
calendarRouter.get("/calendar/fetchTags", getAllTags);
calendarRouter.get("/calendar/fetchAllEvents", getAllEvents);
calendarRouter.get(
  "/calendar/fetchEventByStartDate/:startDate",
  getEventByStartDate
);
calendarRouter.get("/calendar/fetchEventDetails/:eventname", getEventDetails);
calendarRouter.get(
  "/calendar/fetchannouncementDetails",
  getannouncementDetails
);
calendarRouter.post("/calendar/addannouncements", addAnnouncements);
calendarRouter.get(
  "/calendar/fetchannouncementinfo/:annNo",
  getAnnouncementInfo
);
calendarRouter.post("/calendar/postuserstats", putUserStatistics);
calendarRouter.get("/calendar/fetchuserstats/:eventname", getUserStatistics);
calendarRouter.post(
  "/calendar/postenrolledusersDetails",
  putEnrolledUsersDetails
);
calendarRouter.get(
  "/calendar/fetchenrolledusersDetails/:eventname",
  getEnrolledUsersDetails
);
calendarRouter.post("/calendar/postusersdetails", putUserDetails);
calendarRouter.get("/calendar/fetchusersdetails/:eventname", getUserDetails);

module.exports = calendarRouter;
