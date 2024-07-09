const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoursePageBuilderSchema = new mongoose.Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    unique: true,
  },
  pageName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  pageTemplate: {
    type: String,
    required: true,
  },
  htmlTemplate: {
    type: String,
    required: true,
  },
  cssTemplate: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  userName: {
    type: String,
    required: true,
  },
  //   netlifyLink: {
  //     type: String,
  //     required: true,
  //   },
  previewImage: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("CoursePageBuilder", CoursePageBuilderSchema);
