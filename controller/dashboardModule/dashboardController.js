const { UserStatsSchema, UserStats } = require("../../model/CalendarSchema");
const { CreateNotification } = require("../../model/NotificationSchema");
const UserDetails = require("../../model/UserDetailsSchema");
const User = require("../../model/UserSchema");
const { Course } = require("../../model/courseBuilder/CourseSchema");

exports.fetchAllLearnerCount = async (req, res) => {
  try {
    const allLearnerCount = await User.countDocuments({
      role: "Learner",
      deleteStatus: false,
    });
    console.log(allLearnerCount);
    res.json({ allLearnerCount });
  } catch (error) {
    console.error("Error fetching Learner:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.fetchAllInstructors = async (req, res) => {
  try {
    const allInstructors = await User.find({
      role: "Instructor",
      deleteStatus: false,
    });
    console.log(allInstructors);
    res.status(200).json(allInstructors);
  } catch (error) {
    console.error("Error fetching Instructor:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.fetchAllCoursesCount = async (req, res) => {
  try {
    const allCoursesCount = await Course.countDocuments({});
    console.log(allCoursesCount);
    res.json({ allCoursesCount });
    // res.json({ message: "Courses are fetched:" });
  } catch (error) {
    console.error("Error fetching Instructor:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.fetchAllNotifications = async (req, res) => {
  try {
    const allNotificaions = await CreateNotification.find({});
    console.log("Notificationed Fetched");
    res.status(200).json(allNotificaions);
  } catch (error) {
    console.error("Error fetching Instructor:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.fetchAllActiveUsers = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    console.log(thirtyDaysAgo);

    const activeUsers = await User.aggregate([
      {
        $match: {
          lastLogin: { $gte: thirtyDaysAgo },
          deleteStatus: false,
          blacklisted: false,
        },
      },
    ]);
    res.status(200).json(activeUsers);
  } catch (error) {
    console.error("Error fetching Instructor:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.fetchActiveLearners = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    console.log(thirtyDaysAgo);

    const activeLearners = await User.aggregate([
      {
        $match: {
          lastLogin: { $gte: thirtyDaysAgo },
          role: "Learner",
          deleteStatus: false,
          blacklisted: false,
        },
      },
      { $count: activeLearners },
    ]);
    res.status(200).json(activeLearners);
  } catch (error) {
    console.error("Error fetching Instructor:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.fetchTopFiveEvents = async (req, res) => {
  try {
    const topEvents = await UserStats.aggregate([
      { $sort: { totalRegistrations: -1 } },
      { $limit: 5 },
    ]);
    res.json(topEvents);
  } catch (error) {
    console.error("Error fetching Instructor:", error);
    res.status(500).json({ error: error.message });
  }
};
