const mongoose = require('mongoose');

const AssessmentTypeSchema = new mongoose.Schema({

  typeName: { type: String, required: true }, // This is the name of the test type (e.g., quiz, exam).
  typeDescription: { type: String }, // This is an optional description of the test type.
  langCode:{type: String, required: true , default : "en"}
});

module.exports = mongoose.model('AssessmentType', AssessmentTypeSchema);
