const { CreateNotification } = require("../../model/NotificationSchema");

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
