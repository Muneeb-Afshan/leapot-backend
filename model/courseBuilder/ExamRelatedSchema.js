const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const questionSchema = new Schema({
    questionText: { type: String, required: true },
    points: { type: Number, default: 1 },
    enableFileUpload: { type: Boolean, default: false },
    minimumWordsRequired: { type: Number, default: 0 }
});

const assignmentSchema = new Schema({
    courseId : {type: Schema.Types.ObjectId, required: true},
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    dueDate: { type: Date },
  
});

const assignment = mongoose.model('assignmentSchema', assignmentSchema);
module.exports = { assignment };

