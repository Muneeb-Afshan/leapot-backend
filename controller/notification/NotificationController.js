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
