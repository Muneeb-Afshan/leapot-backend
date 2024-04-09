// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Define the Course schema
// const courseSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     instructorName: {
//         type: [String], // Array of strings for multiple names
//         required: true
//     },
//     certificateAvailable: {
//         type: Boolean,
//         default: false // Assuming certificates are not available by default
//     },
//     isExam: {
//         type: Boolean,
//         default: false // Assuming it's not an exam by default
//     },
//     startDate: {
//         type: Date,
//         required: true
//     },
//     endDate: {
//         type: Date,
//         required: true
//     }
// });

// // Create a Course model
// const Course = mongoose.model('Course', courseSchema);

// module.exports = Course;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define content schema
const contentSchema = new Schema({
    items: String
});

// Define lesson schema
const lessonSchema = new Schema({
    name: String,
    content: [contentSchema]
});

// Define module schema
const moduleSchema = new Schema({
    title: String,
    description: String,
    lesson: [lessonSchema]
});

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
    modules: [moduleSchema]
});

// Create Course model
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;




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
