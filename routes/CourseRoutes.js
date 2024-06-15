const express = require('express');
const upload = require('../controller/course/FileUpload');
const courseRouter = express.Router();
const {createCourse ,fetchCourses , addCourseDetails , fetchCoursesWithDetails , fetchAllCoursesWithDetails , logicalDeleteCourse} = require('../controller/course/CourseController');
const {addMessage, getMessages, thumbUp, thumbDown} = require('../controller/course/CourseDiscussion');
const {registerLearner} = require('../controller/course/RegistrationController');
const {uploadVideo} =require('../controller/fileUpload/uploadFileController')

//  const {  addCourseDetails , getAllCourses} = require('../controller/course/CourseController');
const verifyToken = require('../middleware/TokenVerifyMiddleware');


courseRouter.post('/event/eventRegistration',registerLearner);
courseRouter.post('/course/createCourse',createCourse);
courseRouter.post('/course/addCourseDetails',addCourseDetails);
courseRouter.get('/course/fetchCourses',fetchCourses);
courseRouter.get('/course/fetchCoursesWithDetails',fetchCoursesWithDetails);
courseRouter.get('/course/fetchAllCoursesWithDetails',fetchAllCoursesWithDetails);
courseRouter.put('/course/logicalDeleteCourse/:id',logicalDeleteCourse);
courseRouter.post('/course/uploadVideo',uploadVideo);




courseRouter.post('/course/addMessage',addMessage);
courseRouter.get('/course/:courseId',getMessages);
courseRouter.put('/course/messages/:messageId/thumbDown', thumbDown);
courseRouter.put('/course/messages/:messageId/thumbUp', thumbUp);


module.exports = courseRouter;
