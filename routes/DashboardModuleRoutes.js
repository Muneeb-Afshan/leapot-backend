const express = require("express");
const {
  fetchAllLearnerCount,
  fetchAllInstructors,
  fetchAllCoursesCount,
  fetchAllNotifications,
  fetchActiveLearners,
  fetchAllActiveUsers,
  fetchTopFiveEvents,
} = require("../controller/dashboardModule/dashboardController");
const dashboardModuleRouter = express.Router();

dashboardModuleRouter.get(
  "/dashbaordmodule/fetchAllLearnerCount",
  fetchAllLearnerCount
);
dashboardModuleRouter.get(
  "/dashbaordmodule/fetchAllInstructor",
  fetchAllInstructors
);
dashboardModuleRouter.get(
  "/dashbaordmodule/fetchAllCoursesCount",
  fetchAllCoursesCount
);
dashboardModuleRouter.get(
  "/dashbaordmodule/fetchAllNotification",
  fetchAllNotifications
);
dashboardModuleRouter.get(
  "/dashbaordmodule/fetchAllActiveUsers",
  fetchAllActiveUsers
);
dashboardModuleRouter.get(
  "/dashbaordmodule/fetchActiveLeaners",
  fetchActiveLearners
);
dashboardModuleRouter.get(
  "/dashbaordmodule/fetchTopEvents",
  fetchTopFiveEvents
);

module.exports = dashboardModuleRouter;
