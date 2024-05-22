const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId,ref: 'EventModules', required: true },
  descriptions: { type: [String], required: true },
  content: { type: Object, required: true },
  sequenceOfLesson: { type: Number, required: true },
  assessmentScore: { type: Number },
  completionStatus: { type: Number, required: true },
  langCode:{type: String, required: true , default : "en"},
});

module.exports = mongoose.model('Lesson', LessonSchema);
