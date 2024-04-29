const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define course schema
const courseSchema = new Schema({
    courseid: String,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        // required: true
    },
    instructorName: {
        type: [String], // Array of strings for multiple names
        required: true
    },
    certificateAvailable: {
        type: Boolean,
        default: false // Assuming certificates are not available by default
    },
    isExam: {
        type: Boolean,
        default: false // Assuming it's not an exam by default
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isDeleted :{
        type: Boolean,
        default:false
    },
    isPublished :{
        type: Boolean,
        default:false
    },
    createdBy:{
        type: String,
        required: true
    }
});

// Create Course model
const Course = mongoose.model('Course', courseSchema);




// const courseData = {
//     courseid: "CS101",
//     modules: [{
//         title: "Introduction to Computer Science",
//         description: "An introductory course to the fundamentals of computer science.",
//         lesson: [{
//             name: "Introduction to Algorithms",
//             content: [{
//                 items: "What is an algorithm?"
//             }, {
//                 items: "Basic algorithmic techniques"
//             }]
//         }, {
//             name: "Data Structures",
//             content: [{
//                 items: "Arrays and linked lists"
//             }, {
//                 items: "Stacks and queues"
//             }]
//         }]
//     }]
// };




// Define the Topic schema
const topicSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  contentType: { type: String, required: true },
  downloadble : {type:Boolean, default:false }

});

// Define the Chapter schema
const chapterSchema = new Schema({
  chapter_id: { type: String, required: true },
  chapter_name: { type: String, required: true }, // Add chapter_name field
  topics: [topicSchema] // Array of topics
});

// Define the Module schema
const moduleSchema = new Schema({
  module_id: { type: String, required: true },
  module_title: { type: String, required: true }, // Add module_title field
  chapters: [chapterSchema] // Array of chapters
});

// Define the Course schema
const courseDetailsSchema = new Schema({
  course_id: {  type: Schema.Types.ObjectId, ref:'Course', required: true },
//   userid: { type: Schema.Types.ObjectId, ref:'User', unique: true }, // Corrected to ObjectId

  modules: [moduleSchema] // Array of modules
});

// Create models for each schema
const Topic = mongoose.model('Topic', topicSchema);
const Chapter = mongoose.model('Chapter', chapterSchema);
const Module = mongoose.model('Module', moduleSchema);
const CourseDetails = mongoose.model('CourseDetails', courseDetailsSchema);

module.exports = { Topic, Chapter, Module, CourseDetails , Course };
