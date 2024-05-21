const mongoose = require('mongoose');

const EventDetailsSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // This field should be a reference to the Event model.
  difficultyLevel: { type: String }, // This field can specify the difficulty level of the event (e.g., beginner, intermediate, advanced).
  startTime: { type: Date }, // This is the start time of the event.
  endTime: { type: Date }, // This is the end time of the event.
  startDate: { type: Date }, // This is the start date of the event.
  endDate: { type: Date }, // This is the end date of the event.
  duration: { type: String }, // This field can store the duration of the event in a human-readable format (e.g., 1 hour, 2 days).
  assessmentScore: { type: Number }, // This field is optional and can store the average assessment score for the event.
  courseProgress: { type: String }, // This field is optional and can store the progress of the event (e.g., not started, in progress, completed).
  courseAvailable: { type: Boolean, required: true ,default:true }, // This field indicates whether the event is currently available or not.
  courseValidity: { type: Date }, // This field is optional and can store the validity period of the event (e.g., until May 31, 2024).
  isFree: { type: Boolean, required: true , default:true }, // This field indicates whether the event is free or not.
  price: { type: Number }, // This field is optional and can store the price of the event if it is not free.
  priceDiscount: { type: Number }, // This field is optional and can store the discount offered on the event price.
  deadline: { type: Date }, // This field is optional and can store the deadline for registering for the event.
  langCode:{type: String, required: true , default : "en"},
});

module.exports = mongoose.model('EventDetails', EventDetailsSchema);
