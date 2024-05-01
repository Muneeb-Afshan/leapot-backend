const {
  TagsDetails,
  UserStats,
  Announcements,
  EventEnrolledUsers,
  EventUsersDetails,
  AddAnnouncements,
} = require("../../model/CalendarSchema");
const EventModule = require("../../model/Events");

// Controller to handle POST request to add tags to the database
exports.putAllTags = async (req, res) => {
  try {
    const { tagNo, tags_name } = req.body;
    // Check if the tag_name already exists in the database
    const existingTag = await TagsDetails.findOne({ tags_name });
    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    // If the tag_name doesn't exist, create a new tag
    const newTag = await TagsDetails.create({
      tagNo,
      tags_name,
    });
    return res.status(200).json(newTag);
  } catch (error) {
    res.st;
  }
};
//Controller to fetch tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await TagsDetails.find({});
    return res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to fetch all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await EventModule.find({});
    return res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to fetch a particular event details
exports.getEventDetails = async (req, res) => {
  try {
    const { eventname } = req.params;
    const eventdetails = await EventModule.findOne(
      { EventName: eventname },
      "EventName EventDesp InstName EventId Duration CourseType SDate CourseFees Tags tagsInput CourseLearningOutcomes "
    );
    if (!eventdetails) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).send({
      eventdetails: eventdetails,
      statusCode: 200,
      message: "Events details fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to fetch all event based on start date
exports.getEventByStartDate = async (req, res) => {
  try {
    const { startDate } = req.params;
    const event = await EventModule.find(
      { SDate: startDate },
      "STime EventName CourseType EventDesp"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({
      event: event,
      statusCode: 200,
      message: "Event fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to fetch all announcement details
exports.getannouncementDetails = async (req, res) => {
  try {
    const announcements = await AddAnnouncements.find({});
    return res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAnnouncements = async (req, res) => {
  try {
    const { announcementNo, eventName, eventDate, type, image } = req.body;
    const newAnnouncement = await AddAnnouncements.create({
      announcementNo,
      eventName,
      eventDate,
      type,
      image,
    });
    return res.status(200).send({
      newAnnouncement: newAnnouncement,
      statusCode: 200,
      message: "announcements fetched successfully",
    });
    // return res.status(200).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//controller to fetch announcement information about specific announcement
exports.getAnnouncementInfo = async (req, res) => {
  try {
    const { annNo } = req.params;
    // const announcements = await AddAnnouncements.findById(req.params.id);
    const announcements = await AddAnnouncements.findOne({
      announcementNo: annNo,
    });
    if (!announcements) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    return res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to post all user staticstics in database
exports.putUserStatistics = async (req, res) => {
  try {
    const {
      EventName,
      totalRegistrations,
      activeRegistrations,
      cancelRegistrations,
      paymentPending,
    } = req.body;
    const newUserStats = await UserStats.create({
      EventName,
      totalRegistrations,
      activeRegistrations,
      cancelRegistrations,
      paymentPending,
    });

    return res.status(200).json(newUserStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to fetch all user staticstics
exports.getUserStatistics = async (req, res) => {
  try {
    const { eventname } = req.params;
    const userstats = await UserStats.find({ EventName: eventname });
    if (!userstats) {
      return res.status(404).json({ message: "User Staticstics not found" });
    }
    return res.status(200).json(userstats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to post enrolled users details
exports.putEnrolledUsersDetails = async (req, res) => {
  try {
    const {
      EventName,
      userName,
      email,
      phoneNumber,
      payment_status,
      joiningDate,
    } = req.body;
    const newenrolledusers = await EventEnrolledUsers.create({
      EventName,
      userName,
      email,
      phoneNumber,
      payment_status,
      joiningDate,
    });

    return res.status(200).json(newenrolledusers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Controller to fetch enrolled users details
exports.getEnrolledUsersDetails = async (req, res) => {
  try {
    const { eventname } = req.params;
    const enrolledusers = await EventEnrolledUsers.find({
      EventName: eventname,
    });
    if (!enrolledusers) {
      return res.status(404).json({ message: "Enrolled users not found" });
    }
    return res.status(200).json(enrolledusers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Controller to post users details
exports.putUserDetails = async (req, res) => {
  try {
    const { EventName, userName, email, phoneNumber, status } = req.body;
    const newusers = await EventUsersDetails.create({
      EventName,
      userName,
      email,
      phoneNumber,
      status,
    });

    return res.status(200).json(newusers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to fetch enrolled users details
exports.getUserDetails = async (req, res) => {
  try {
    const { eventname } = req.params;
    const userdetails = await EventUsersDetails.find({
      EventName: eventname,
    });
    if (!userdetails) {
      return res.status(404).json({ message: "user details not found" });
    }
    return res.status(200).json(userdetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
