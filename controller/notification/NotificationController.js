const {
  CreateNotification,
  SendNotification,
  NotificationSettings,
} = require("../../model/NotificationSchema");
//controller to post notifications
exports.createNotification = async (req, res) => {
  try {
    const { notificationType, subject, notificationBody } = req.body;
    const newnotifications = await CreateNotification.create({
      notificationType,
      subject,
      notificationBody,
    });

    return res.status(200).json(newnotifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//controller to fetch notifications
exports.fetchNotification = async (req, res) => {
  try {
    const templatenot = await CreateNotification.find({ isDeleted: false });
    return res.status(200).json(templatenot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//controller to fetch single notifications
exports.fetchSingleNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const notify = await CreateNotification.find({ _id: id });
    return res.status(200).json(notify);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//controller to update existing notifications
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { notificationType, subject, notificationBody } = req.body;
    // Update the notification using findByIdAndUpdate
    const updatednotification = await CreateNotification.findByIdAndUpdate(
      { _id: id }, // ID to update
      { notificationType, subject, notificationBody }, // Updated notification data
      { new: true } // Return the updated document
    );
    if (!updatednotification) {
      return res.status(404).json({ message: "notification not found" });
    }
    return res.status(200).send({
      body: updatednotification,
      statusCode: 200,
      message: " Notification updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
};

//controller to logically delete notifications
exports.logicalDeleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;

    // Find the notification by ID and update it
    const deleteNotification = await CreateNotification.findOneAndUpdate(
      { _id: notificationId },
      { $set: { isDeleted: true } },
      { new: true } // Return the updated document
    );

    // If the notification doesn't exist, return 404 Not Found
    if (!deleteNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Respond with success message
    return res.status(200).json({
      message: "Notification deleted",
      notification: deleteNotification,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error in logicalDeleteNotification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//controller to post notifications to individual user
exports.sendNotifications = async (req, res) => {
  try {
    const { email_Type, email_Subject, email_Body, cc, bcc, user_recipients } =
      req.body;
    const individualnotification = await SendNotification.create({
      email_Type,
      cc,
      bcc,
      email_Subject,
      email_Body,
      user_recipients,
    });

    return res.status(200).json(individualnotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//controller to fetch notifications send details

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await SendNotification.find({});
    return res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller method to search notifications
exports.searchNotifications = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    // Perform the database query to search notifications
    const notifications = await CreateNotification.find({
      $or: [
        { notificationType: { $regex: searchQuery, $options: "i" } },
        { subject: { $regex: searchQuery, $options: "i" } },
      ],
      isDeleted: false,
    });

    // Return the filtered notifications
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error searching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to create notification settings
exports.createNotificationSettings = async (req, res) => {
  try {
    console.log(req.body);
    const { settingsName, description, roles } = req.body;

    // If roles include "Select All", set roles to all predefined roles
    const rolesToSave = roles.includes("Select All")
      ? ["Admin", "Learner", "Instructor", "Course Reviewer"]
      : roles;

    const newNotificationSettings = await NotificationSettings.create({
      settingsName,
      description,
      roles: rolesToSave,
    });

    return res.status(200).json(newNotificationSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//controller to fetch settings based on roles
exports.getNotificationsByRole = async (req, res) => {
  try {
    const { role } = req.params;

    let notifications;
    if (role === "Select All") {
      notifications = await NotificationSettings.find({});
    } else {
      notifications = await NotificationSettings.find({ roles: role });
    }

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to toggle the isEnabled field
exports.toggleNotificationSettings = async (req, res) => {
  try {
    const settingsId = req.params.id;
    // Find the settings by ID and update it
    const notificationSettings = await NotificationSettings.findOneAndUpdate(
      { _id: settingsId },
      { $set: { isEnabled: true } },
      { new: true } // Return the updated document
    );

    // If the settings doesn't exist, return 404 Not Found
    if (!notificationSettings) {
      return res.status(404).json({ error: "Notification settings not found" });
    }

    // Respond with success message
    return res.status(200).json({
      message: "Notification settings updated ",
      notification: notificationSettings,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error in settingsNotification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
