const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizquestionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [{ type: String }],
  answers: [{ type: String, required: true }], // Array to handle different types of answers
  points: { type: Number, default: 0 },
});
// Define the schema for the options
const optionSchema = new Schema({
  text: { type: String, required: true },
  index: { type: Number, required: true },
});

// Define the schema for the prompts
const promptSchema = new Schema({
  text: { type: String, required: true },
  correctOptionIndex: { type: Number, required: true },
});

// Define the schema for Match the Pair questions
const MatchThePairSchema = new Schema({
  prompts: [promptSchema],
  options: [optionSchema],
});
const QuizSettingsSchema = new Schema({
  isQuizMandatory: { type: Boolean, default: false },
  areAllQuestionsRequired: { type: Boolean, default: false },
  shuffleQuestions: { type: Boolean, default: false },
  shuffleAnswers: { type: Boolean, default: false },
  passingPercentage: { type: Number, min: 0, max: 100 },
  enableQuizTimer: { type: Number, default: 60 }, // time in seconds
  showScoreOnCompletion: { type: Boolean, default: false },
  allowReviewOfAnswers: { type: Boolean, default: false },
  showCorrectAnswersPostCompletion: { type: Boolean, default: false },
  maximumAttempts: { type: Number, default: 1 },
});

const QuizSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  quizType: {
    type: String,
    enum: [
      "MCQ",
      "MultipleResponse",
      "TrueOrFalse",
      "SelectCorrectImage",
      "MatchThePair",
    ],
    required: true,
  },
  description: { type: String },
  // questions: [QuizquestionSchema],
  questions: {
    type: [
      {
        type: Schema.Types.Mixed,
        required: true,
        validate: {
          validator: function (value) {
            if (this.quizType === "MatchThePair") {
              return MatchThePairSchema.validate(value);
            } else {
              return QuizquestionSchema.validate(value);
            }
          },
          message: (props) =>
            `${props.value} is not a valid question format for the quiz type!`,
        },
      },
    ],
  },
  settings: { type: QuizSettingsSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  dueDate: { type: Date },
});

module.exports = mongoose.model("Quiz", QuizSchema);
