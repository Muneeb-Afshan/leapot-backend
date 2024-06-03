const express = require('express');
const courseRouter = express.Router();
const {createCourse ,fetchCourses , addCourseDetails , fetchCoursesWithDetails , fetchAllCoursesWithDetails , logicalDeleteCourse} = require('../controller/course/CourseController');
const {registerLearner} = require('../controller/course/RegistrationController');
// const {  addCourseDetails , getAllCourses} = require('../controller/course/CourseController');
const verifyToken = require('../middleware/TokenVerifyMiddleware');


courseRouter.post('/event/eventRegistration',registerLearner);
courseRouter.post('/course/createCourse',createCourse);
courseRouter.post('/course/addCourseDetails',verifyToken,addCourseDetails);
courseRouter.get('/course/fetchCourses',fetchCourses);
courseRouter.get('/course/fetchCoursesWithDetails',fetchCoursesWithDetails);
courseRouter.get('/course/fetchAllCoursesWithDetails',fetchAllCoursesWithDetails);
courseRouter.put('/course/logicalDeleteCourse/:id',logicalDeleteCourse);



module.exports = courseRouter;
