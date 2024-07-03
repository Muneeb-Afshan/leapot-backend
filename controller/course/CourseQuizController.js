const Quiz = require("../../model/courseBuilder/QuizSchema");
const { Course } = require("../../model/courseBuilder/CourseSchema");

// Create a new quiz

exports.createQuiz = async (req, res) => {
  try {
    const { courseId, title, questions, settings, quizType } = req.body;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    // Validate questions based on quizType
    questions.forEach((question) => {
      if (
        quizType === "MCQ" &&
        (!question.answers || question.answers.length !== 1)
      ) {
        throw new Error("MCQ type questions must have exactly one answer");
      }
      if (
        quizType === "MultipleResponse" &&
        (!question.answers || question.answers.length < 1)
      ) {
        throw new Error(
          "Multiple Response type questions must have at least one answer"
        );
      }
      if (
        quizType === "TrueOrFalse" &&
        (!question.answers || question.answers.length !== 1)
      ) {
        throw new Error(
          "TrueOrFalse type questions must have exactly one answer"
        );
      }
      if (quizType === "MatchThePair") {
        if (!question.prompts || !question.options) {
          throw new Error(
            "MatchThePair type questions must have prompts and options"
          );
        }
        if (
          !Array.isArray(question.prompts) ||
          !Array.isArray(question.options)
        ) {
          throw new Error("Prompts and options must be arrays");
        }
        question.prompts.forEach((prompt) => {
          if (
            typeof prompt.text !== "string" ||
            typeof prompt.correctOptionIndex !== "number"
          ) {
            throw new Error(
              "Each prompt must have a text and a correctOptionIndex"
            );
          }
        });
        question.options.forEach((option) => {
          if (
            typeof option.text !== "string" ||
            typeof option.index !== "number"
          ) {
            throw new Error("Each option must have a text and an index");
          }
        });
      }
    });
    // Create a new quiz instance
    const newQuiz = new Quiz({
      courseId,
      title,
      questions,
      settings,
      quizType,
    });

    // Save the quiz to the database
    const savedQuiz = await newQuiz.save();

    // Return the saved quiz
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Error creating quiz" });
  }
};
