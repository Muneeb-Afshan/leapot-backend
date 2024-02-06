const mongoose = require('mongoose');

const SubmissionDetailsSchema = new mongoose.Schema({
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true }, // This is a reference to the Assessment model.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // This is a reference to the User model.
  correctAnswers: [Number], // This is an array of the correct answers for each question (may be empty if not graded yet).
  userAnswers: [String], // This is an array of the user's answers for each question.
  uploadFile: { type: String }, // This is an optional field for any uploaded files associated with the submission.
  submissionStatus: { type: String, required: true }, // This is the status of the submission (e.g., pending, graded, reviewed).
  evaluationStatus: { type: String }, // This is the evaluation status of the submission (e.g., passed, failed, needs review).
  markPerQuestion: [Number], // This is an array of the marks for each question (may be empty if not graded yet).
  submissionDate: { type: Date, required: true }, // This is the date and time the submission was made.
});

module.exports = mongoose.model('AssessSubmissionDetails', SubmissionDetailsSchema);
