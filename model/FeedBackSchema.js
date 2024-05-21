const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
 
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // This field should be a reference to the User model.
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true }, // This field should be a reference to the Event model.
  rating: { type: Number, required: true }, // This could be a number between 1 and 5, for example.
  comments: { type: String }, // This could be a string containing the user's feedback.
  langCode:{type: String, required: true , default : "en"},
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
