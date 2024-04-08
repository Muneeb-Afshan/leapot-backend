const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Course schema
const courseSchema = new Schema({
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
    }
});

// Create a Course model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
