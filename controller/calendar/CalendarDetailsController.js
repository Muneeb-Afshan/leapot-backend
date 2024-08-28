const cron = require("node-cron");
const {
  TagsDetails,
  UserStats,
  Announcements,
  EventEnrolledUsers,
  EventUsersDetails,
  AddAnnouncements,
} = require("../../model/CalendarSchema");
const EventModel = require("../../model/Events");
const User = require("../../model/UserSchema");
const RegisterLearner = require("../../model/RegistrationSchema");

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

// Controller to fetch events by tag
exports.getEventsByTags = async (req, res) => {
  try {
    const { tag } = req.params;
    // Query events based on the provided tag
    const events = await EventModel.find({ tags: tag });
    res.status(200).json({ events: events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Controller to fetch tags
// exports.getAllTags = async (req, res) => {
//   try {
//     const tags = await TagsDetails.find({});
//     return res.status(200).json(tags);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.getAllTags = async (req, res) => {
  try {
    const allEvents = await EventModel.find({ isDeleted: false }, "tags");
    let allTags = [];
    allEvents.forEach((event) => {
      allTags = allTags.concat(event.tags);
    });
    // Remove duplicate tags
    const uniqueTags = [...new Set(allTags)];
    return res.status(200).send(uniqueTags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to fetch all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find({});
    return res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to fetch a particular event details
exports.getEventDetails = async (req, res) => {
  try {
    const { eventname } = req.params;
    const eventdetails = await EventModel.findOne({ EventName: eventname });
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
    const event = await EventModel.find(
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

//Controller to cancel the announcement
exports.cancelAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const cancelannouncement = await AddAnnouncements.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!cancelannouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    return res.status(200).json(cancelannouncement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAnnouncements = async (req, res) => {
  try {
    const {
      announcementNo,
      eventName,
      eventDate,
      eventEndDate,
      type,
      image,
      startTime,
      endTime,
      active,
      langCode,
    } = req.body;
    const newAnnouncement = await AddAnnouncements.create({
      announcementNo,
      eventName,
      eventDate,
      eventEndDate,
      type,
      image,
      startTime,
      endTime,
      active,
      langCode,
    });
    console.log(langCode);
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
// exports.putUserStatistics = async (req, res) => {
//   try {
//     const {
//       EventName,
//       totalRegistrations,
//       activeRegistrations,
//       cancelRegistrations,
//       paymentPending,
//     } = req.body;
//     const newUserStats = await UserStats.create({
//       EventName,
//       totalRegistrations,
//       activeRegistrations,
//       cancelRegistrations,
//       paymentPending,
//     });

//     return res.status(200).json(newUserStats);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Controller to fetch all user staticstics
// exports.getUserStatistics = async (req, res) => {
//   try {
//     const { eventname } = req.params;
//     const userstats = await UserStats.find({ EventName: eventname });
//     if (!userstats) {
//       return res.status(404).json({ message: "User Staticstics not found" });
//     }
//     return res.status(200).json(userstats);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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

//controller to enroll user for a event
exports.enrollUsersforEvent = async (req, res) => {
  console.log("Enroll users endpoint hit"); // Debugging log

  const { eventName } = req.params; // Assuming you pass eventName as a parameter
  const { emails } = req.body; // An array of emails to enroll

  try {
    console.log(`Finding event: ${eventName}`); // Debugging log

    // Find event by eventName
    const event = await EventModel.findOne({ EventName: eventName });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    console.log("Event found:", event); // Debugging log

    // Find users by email and enroll them in the event
    const users = await User.find({ email: { $in: emails } });

    // Add event to user's events array and create a registration record
    users.forEach(async (user) => {
      if (!user.events.includes(eventName)) {
        user.events.push(eventName);
        await user.save();

        // Create a new registration record for the user
        const registration = new RegisterLearner({
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          userid: user._id, // Reference to the user
          eventid: event._id, // Reference to the event
          eventname: event.eventName, // Reference to the event
          registrationDate: new Date(), // Current date and time
          registrationStatus: true, // Assuming the user is successfully registered
          langCode: "en", // Default language code
          // Add courseid, paymentid, and other fields as needed
        });

        await registration.save();
        console.log(
          `User ${user.email} enrolled and registration record created.`
        );
      }
    });

    res.status(200).json({ message: "Users enrolled successfully", users });
  } catch (error) {
    console.error("Error enrolling users:", error);
    res
      .status(500)
      .json({ message: "Error enrolling users", error: error.message });
  }
};

//controller to fetch users based on event Name
exports.getEnrolledUsers = async (req, res) => {
  try {
    const { eventName } = req.params;
    // Find users who have the event name in their events array
    const users = await User.find({ events: { $in: [eventName] } });
    // Log found users for debugging
    console.log("Found users:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching enrolled users:", error);
    res
      .status(500)
      .json({ message: "Error fetching enrolled users", error: error.message });
  }
};

// Function to get total registrations and active registrations for a course
exports.getUserStatistics = async (req, res) => {
  try {
    console.log("Request received for course:", req.params.eventName);
    const { eventName } = req.params;

    // Total Registrations: users for whom the course name is present in the events array
    const totalRegistrations = await User.countDocuments({
      events: eventName,
      deleteStatus: false,
    });

    // Active Registrations: users whose signInCount is greater than 1
    const activeRegistrations = await User.countDocuments({
      events: eventName,
      "learnerDetails.signInCount": { $gt: 1 },
      deleteStatus: false,
    });
    // Calculate inactive registrations
    const pendingRegistrations = totalRegistrations - activeRegistrations;

    console.log("Total Registrations:", totalRegistrations);
    console.log("Active Registrations:", activeRegistrations);
    console.log("Inactive Registrations:", pendingRegistrations);
    res.status(200).json({
      totalRegistrations,
      activeRegistrations,
      pendingRegistrations,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching registrations." });
  }
};
