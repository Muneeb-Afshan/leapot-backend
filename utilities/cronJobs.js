const cron = require("node-cron");
const mongoose = require("mongoose");
const AddAnnouncements = require("../model/CalendarSchema");

// Cron job to set active:false for past events
cron.schedule("0 0 * * *", async () => {
  // Runs every day at midnight
  try {
    const currentDate = new Date();
    const result = await AddAnnouncements.updateMany(
      { eventEndDate: { $lt: currentDate } },
      { active: false }
    );
    console.log(`Deactivated ${result.nModified} past announcements.`);
  } catch (error) {
    console.error("Error updating past announcements:", error.message);
  }
});
