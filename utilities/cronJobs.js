const cron = require("node-cron");
const mongoose = require("mongoose");
const { AddAnnouncements } = require("../model/CalendarSchema");

//npm install node-cron
//cron.schedule("0 0 * * *", async () => {        // Runs every day at midnight
cron.schedule("*/30 * * * * *", async () => {
  // Runs every 30 seconds
  try {
    const currentDate = new Date();
    // Find the announcements to be deactivated
    const announcementsToDeactivate = await AddAnnouncements.find({
      eventEndDate: { $lt: currentDate },
    });

    // Get the announcementNo of these announcements
    const announcementNos = announcementsToDeactivate.map(
      (a) => a.announcementNo
    );

    // Update the announcements to set active to false
    const result = await AddAnnouncements.updateMany(
      { eventEndDate: { $lt: currentDate } },
      { active: false }
    );
    console.log(
      `Deactivated past announcements with announcementNos: ${announcementNos}`
    );
  } catch (error) {
    console.error("Error updating past announcements:", error.message);
  }
});
