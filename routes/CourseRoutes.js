const express = require('express');
const upload = require('../controller/course/FileUpload');
const courseRouter = express.Router();
const {createCourse ,fetchCourses , addCourseDetails , fetchCoursesWithDetails , fetchAllCoursesWithDetails , logicalDeleteCourse} = require('../controller/course/CourseController');
const {addMessage, getMessages, updateThumbs} = require('../controller/course/CourseDiscussion');
const {registerLearner} = require('../controller/course/RegistrationController');
// const {  addCourseDetails , getAllCourses} = require('../controller/course/CourseController');


courseRouter.post('/event/eventRegistration',registerLearner);
courseRouter.post('/course/createCourse',createCourse);
courseRouter.post('/course/addCourseDetails',addCourseDetails);
courseRouter.get('/course/fetchCourses',fetchCourses);
courseRouter.get('/course/fetchCoursesWithDetails',fetchCoursesWithDetails);
courseRouter.get('/course/fetchAllCoursesWithDetails',fetchAllCoursesWithDetails);
courseRouter.put('/course/logicalDeleteCourse/:id',logicalDeleteCourse);

courseRouter.post('/course/addMessage',addMessage);
courseRouter.get('/course/:courseId',getMessages);
courseRouter.put('/course/:id/thumbs', updateThumbs);

module.exports = courseRouter;
