const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define course schema

// const courseSchema = new Schema({
//     courseid: String,
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     bannerImage: {
//         type: String,
//         // required: true
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
//     },
//     isDeleted :{
//         type: Boolean,
//         default:false
//     },
//     isPublished :{
//         type: Boolean,
//         default:false
//     },
//     createdBy:{
//         type: String,
//         // required: true
//     },

    
// }, {
//     timestamps: true, 
// });


const courseSchema = new mongoose.Schema({
  generalInformation: {
    title: { type: String, required: true },
    description: { type: String },
    courseCode: { type: String, required: true },
    courseDuration: { type: String, required: true },
    courseLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    courseCategory: { type: String },
    prerequisites: { type: String },
    language: { type: String },
    instructorName: [{ }],
    eventName:{},
    bannerImage: { type: String },
    // courseStructure: { type: String, enum: ['CMLT', 'CLT']},
    courseStructure: { type: String, enum: ['CMLT', 'CLT', 'SCORM']},
    scormUrl: { type: String },
    isPublished : { type: Boolean, default: false}
  },
  isPaidCourse: { type: Boolean, default: false },
  pricingDetails: {
    actualAmount: { type: Number },
    discount: { type: Number },
    discountedAmount: { type: Number },
    taxes: { type: Number },
    totalAmount: { type: Number },
  },
  contentManagement: {
    // modulesList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    // courseSyllabus: { type: String },
    learningObjectives: { type: String },
    estimatedTimeToComplete: { type: String },
    
  },
  accessAndEnrollment: {
    enrollmentType: { type: String, enum: ['Open', 'Restricted', 'By Invitation'], required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    maximumEnrollment: { type: Number },
    accessPermissions: { type: String},
    certificateAvailability: { type: Boolean },
    certificateRequirements: { type: String },
  },
  progressTracking: {
    progressIndicators: { type: Boolean },
    enforceSequentialLearningPath: { type: Boolean },
    assessmentMethods: [{ type: Boolean }],
    gradingPolicy: { type: Boolean },
    completionCriteria: { type: Boolean },
  },
}, { timestamps: true });


// Create Course model
const Course = mongoose.model('Course', courseSchema);







// Define the Topic schema
const topicSchema = new Schema({
  moduleId: { type: Number },
  lessonId: { type: Number, required: true },
  id: { type: Number, required: true },
  title: { type: String, required: true },
  textDescription: { 
    type: String, 
    required: function() { return this.contentType === 'Text'; } 
  },
  link: { 
    type: String, 
    required: function() { return this.contentType !== 'Text' &&  this.contentType !== 'Download' }

  },
  links: [String],
  contentType: { type: String},
  fileName: {type: String} ,
  fileNames: [String] ,
  downloadble : {type:Boolean, default:false },
  langCode:{type: String, required: true , default : "en"}
});

// Define the Chapter schema
const chapterSchema = new Schema({
  moduleId: { type: Number },
  id: { type: Number, required: true },

  title: { type: String, required: true },
  items: [topicSchema],

  langCode:{type: String, required: true , default : "en"},

});

// Define the Module schema
const moduleSchema = new Schema({
  id: { type: Number, required: true },

  title: { type: String, required: true },
  lessons: [chapterSchema],
  langCode:{type: String, required: true , default : "en"}

});

// Define the CourseDetails schema
const courseDetailsSchema = new Schema({

  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  // courseStructure: { type: String, enum: ['CMLT', 'CLT'] },
  courseStructure: { type: String, enum: ['CMLT', 'CLT', 'SCORM']},
  modules: [moduleSchema],
  lessons: [chapterSchema],

  langCode:{type: String, required: true , default : "en"}

});

// Create models for each schema
const Topic = mongoose.model('Topic', topicSchema);
const Chapter = mongoose.model('Chapter', chapterSchema);
const Module = mongoose.model('Module', moduleSchema);
const CourseDetails = mongoose.model('CourseDetails', courseDetailsSchema);

module.exports = { Topic, Chapter, Module, CourseDetails , Course };
