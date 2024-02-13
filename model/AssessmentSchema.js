const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  testTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestType', required: true }, // This is a reference to the TestType model.
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true }, // This is a reference to the Event model (if applicable).
  lessonId: { type: mongoose.Schema.Types.ObjectId, required: true }, // This is a reference to the Lesson model.
  testNo: { type: Number, required: true }, // This is the unique number of the assessment.
  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // This is an array of references to the Question model.
  questionType: { type: String, required: true }, // This is the type of question used in the assessment (e.g., multiple choice, true/false).
  instructions: { type: String }, // This is an optional field for any additional instructions for the assessment.
  startDate: { type: Date, required: true }, // This is the start date and time of the assessment.
  endDate: { type: Date, required: true }, // This is the end date and time of the assessment.
  duration: { type: Number }, // This is the duration of the assessment in minutes.
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
