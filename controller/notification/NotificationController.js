const { CreateNotification } = require("../../model/NotificationSchema");
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
    const templatenot = await CreateNotification.find({});
    return res.status(200).json(templatenot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
