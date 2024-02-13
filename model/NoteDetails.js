const mongoose = require('mongoose');

const NoteDetailsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref :"Lesson" , required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model('NoteDetails', NoteDetailsSchema);
