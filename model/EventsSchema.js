const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'EventCategory', required: true }, // This field should be a reference to the EventCategory model.// This field can specify the type of event (e.g., workshop, lecture, webinar).
  eventType: { type: String, required: true }, // This field can specify the type of event (e.g., Recorded, Live, Hybrid).
  title: { type: String, required: true }, // This is the title of the event.
  description: { type: String }, // This is a detailed description of the event.
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // This field is optional and can be a reference to the User model for the instructor.
  coverImageUrl: { type: String }, // This field can store the URL of the event cover image.
});

module.exports= mongoose.model('Event', EventSchema);
