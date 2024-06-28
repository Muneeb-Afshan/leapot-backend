const express = require('express');
const upload = require('../controller/course/FileUpload');
const courseRouter = express.Router();
const {createCourse ,fetchCourses , addCourseDetails , fetchCoursesWithDetails , fetchAllCoursesWithDetails , logicalDeleteCourse, addCoursePage, getAllCourseBuilderPages, getTemplatesByCourseId} = require('../controller/course/CourseController');
const {addMessage, getMessages, thumbUp, thumbDown} = require('../controller/course/CourseDiscussion');
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

courseRouter.post('/course/addMessage',addMessage);
courseRouter.get('/course/:courseId',getMessages);
courseRouter.put('/course/messages/:messageId/thumbDown', thumbDown);
courseRouter.put('/course/messages/:messageId/thumbUp', thumbUp);

courseRouter.post("/course/addcoursepage", addCoursePage);

courseRouter.get("/course/pages/getAllCourseBuilderPages", getAllCourseBuilderPages);
courseRouter.get("/course/getTemplatesByCourseId/:courseId", getTemplatesByCourseId);

module.exports = courseRouter;
