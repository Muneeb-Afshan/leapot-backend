const express = require('express');
const courseRouter = express.Router();
// const {createLesson} = require('../controller/course/CourseController');
const {registerLearner} = require('../controller/course/RegistrationController');
const { createCourse , fetchCourses} = require('../controller/course/CourseController');


courseRouter.post('/event/eventRegistration',registerLearner);
courseRouter.post('/course/createCourse',createCourse);
courseRouter.get('/course/fetchCourses',fetchCourses);


module.exports = courseRouter;
