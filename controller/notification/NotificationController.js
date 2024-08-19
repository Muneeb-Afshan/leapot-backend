const { sendEmail } = require('../emailUtility/SendEmailFunction')
const {
  CreateNotification,
  SendNotification,
  NotificationSettings,
} = require("../../model/NotificationSchema");

//controller to post notifications
exports.createNotification = async (req, res) => {
  try {
    const { notificationType, subject, notificationBody, role } = req.body;
    console.log("check",req.body)
    const newnotifications = await CreateNotification.create({
      role,
      notificationType,
      subject,
      notificationBody,
      // langCode
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
    const { notificationType, subject, notificationBody } =
      req.body.updatedData;
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
    console.log("checkin param ",notificationId);
    
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

//controller to post notifications to  user
exports.sendNotifications = async (req, res) => {
  try {
    const { email_Type, email_Subject, email_Body, cc, bcc, user_recipients, langCode } =
      req.body;
    const individualnotification = await SendNotification.create({
      email_Type,
      cc,
      // bcc,
      email_Subject,
      email_Body,
      user_recipients,
      langCode,
    });

    const emailOptions = {
      from: '"Leapot Technologies" <hr.leapot@gmail.com>',
      to: user_recipients,
      cc: cc,
      // bcc: bcc,
      subject: email_Subject,
      text: email_Body,
      html: `<p>${email_Body}</p>`,
    };

    await sendEmail(emailOptions);

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

exports.singlefetchnotifications = async (req, res) => {
  const { id } = req.params;
  try {
    const notify = await SendNotification.find({ _id: id });
    return res.status(200).json(notify);
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
// exports.createNotificationSettings = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { settingsName, description, roles } = req.body;

//     // If roles include "Select All", set roles to all predefined roles
//     const rolesToSave = roles.includes("Select All")
//       ? [
//           "Admin",
//           "Learner",
//           "Instructor",
//           "Course Reviewer",
//           "Course Developer",
//         ]
//       : roles;

//     const newNotificationSettings = await NotificationSettings.create({
//       settingsName,
//       description,
//       roles: rolesToSave,
//     });

//     return res.status(200).json(newNotificationSettings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Controller function to create notification settings
exports.createNotificationSettings = async (req, res) => {
  try {
    const { settingsName, description, roles, langCode } = req.body;

    // If roles include "Select All", set roles to all predefined roles
    const rolesToSave =
      roles[0].role === "Select All"
        ? [
            { role: "Admin", isEnabled: false },
            { role: "Learner", isEnabled: false },
            { role: "Instructor", isEnabled: false },
            { role: "Course Reviewer", isEnabled: false },
            { role: "Course Developer", isEnabled: false },
          ]
        : roles;

    const newNotificationSettings = await NotificationSettings.create({
      settingsName,
      description,
      roles: rolesToSave,
      langCode
    });

    return res.status(200).json(newNotificationSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//controller to fetch all settings
// exports.getAllNotifications = async (req, res) => {
//   try {
//     const notifications = await NotificationSettings.find({});
//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await NotificationSettings.find({});
    return res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller function to toggle the isEnabled field
// exports.toggleNotificationSettings = async (req, res) => {
//   try {
//     const settingsId = req.params.id;
//     const { role } = req.body;
//     // Find the settings by ID and update it
//     const notificationSettings = await NotificationSettings.findOneAndUpdate(
//       { _id: settingsId, roles: role },
//       { $set: { isEnabled: true } },
//       { new: true } // Return the updated document
//     );

//     // If the settings doesn't exist, return 404 Not Found
//     if (!notificationSettings) {
//       return res.status(404).json({ error: "Notification settings not found" });
//     }

//     // Respond with success message
//     return res.status(200).json({
//       message: "Notification settings updated ",
//       notification: notificationSettings,
//     });
//   } catch (error) {
//     // Handle any errors
//     console.error("Error in settingsNotification:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// Controller function to toggle the isEnabled field for a specific role, if the role doesn't exist then it will be updated correctly
exports.toggleNotificationSettings = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the settings by ID
    const notificationSettings = await NotificationSettings.findById(id);
    console.log(req.body);
    // If the settings doesn't exist, return 404 Not Found
    if (!notificationSettings) {
      return res.status(404).json({ error: "Notification settings not found" });
    }

    // If there's only one role in the data, update its isEnabled field directly
    if (notificationSettings.roles.length === 1) {
      notificationSettings.roles[0].isEnabled = req.body.isEnabled;
    } else {
      // If there are multiple roles, check if role is specified in the request body
      const { role } = req.body;

      // If the role is not specified, return 400 Bad Request
      if (!role) {
        return res
          .status(400)
          .json({ error: "Role must be specified in the request body" });
      }

      // Find the role object in the settings
      const roleObject = notificationSettings.roles.find(
        (roleObj) => roleObj.role === role
      );

      // If the role object doesn't exist, return 400 Bad Request
      if (!roleObject) {
        return res
          .status(400)
          .json({ error: "Role not found in notification settings" });
      }

      // Update the isEnabled field for the specified role
      roleObject.isEnabled = req.body.isEnabled;
    }

    // Save the updated settings
    await notificationSettings.save();

    // Respond with success message
    return res.status(200).json({
      message: "Notification settings updated ",
      notification: notificationSettings,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error in toggleNotificationSettings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
