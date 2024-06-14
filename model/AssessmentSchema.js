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
  langCode:{type: String, required: true , default : "en"}
});

module.exports = mongoose.model('Assessment', AssessmentSchema);















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
  dueDate: { type: Date }
});




const QuizquestionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctOption: { type: String, required: true },
  points: { type: Number, default: 1 }
});


const quizSchema = new Schema({
  
  courseId : {type: Schema.Types.ObjectId, required: true},
  title: { type: String, required: true },
  description: { type: String },
  questions: [QuizquestionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  dueDate: { type: Date }
});



const studentSubmissionSchema = new Schema({
  type: { type: String, enum: ['Assignment', 'Quiz', 'Exam'], required: true },
  assessment: { type: Schema.Types.ObjectId, required: true, refPath: 'type' },
  studentId: { type: String, required: true },
  answers: [{
      questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
      answerText: { type: String },
      fileUpload: { type: String }, // Store the file path or URL
      wordsCount: { type: Number }
  }],
  status: { type: String, enum: ['submitted', 'graded', 'cheked'], default: 'submitted' },
  marks: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  gradedAt: { type: Date }
});









const questionDataArray = [
  {
      questionText: "What is the capital of France?",
      points: 2,
      enableFileUpload: false,
      minimumWordsRequired: 0
  },
  {
      questionText: "Who wrote 'Romeo and Juliet'?",
      points: 3,
      enableFileUpload: true,
      minimumWordsRequired: 10
  }
];

const assignmentDataArray = [
  {
      courseId: "Course123", // Example course ID
      title: "History Assignment",
      description: "Complete the following questions about world history.",
      questions: questionDataArray,
      dueDate: new Date("2024-06-30"),
      instructor: "Instructor123" // Example instructor ID
  },
  {
      courseId: "Course456", // Example course ID
      title: "Science Project",
      description: "Present a scientific project on any topic of your choice.",
      questions: [],
      dueDate: new Date("2024-07-15"),
      instructor: "Instructor456" // Example instructor ID
  }
];


const quizDataArray = [
  {
      courseId: "Course789", // Example course ID
      title: "Math Quiz",
      description: "Test your math skills with these questions.",
      questions: questionDataArray,
      dueDate: new Date("2024-08-15"),
      instructor: "Instructor789" // Example instructor ID
  },
  {
      courseId: "Course101", // Example course ID
      title: "Literature Quiz",
      description: "Answer questions about famous literary works.",
      questions: [],
      dueDate: new Date("2024-09-30"),
      instructor: "Instructor101" // Example instructor ID
  }
];

const studentSubmissionDataArray = [
  {
      type: "Assignment",
      assessment: "Assignment123", // Example assignment ID
      studentId: "Student789", // Example student ID
      answers: [
          {
              questionId: "Question123", // Example question ID
              answerText: "Paris",
              fileUpload: "",
              wordsCount: 1
          }
      ],
      status: "submitted",
      marks: 0,
      submittedAt: new Date("2024-06-25")
  },
  {
      type: "Quiz",
      assessment: "Quiz456", // Example quiz ID
      studentId: "Student101", // Example student ID
      answers: [
          {
              questionId: "Question456", // Example question ID
              answerText: "William Shakespeare",
              fileUpload: "",
              wordsCount: 2
          }
      ],
      status: "submitted",
      marks: 0,
      submittedAt: new Date("2024-07-05")
  }
];
