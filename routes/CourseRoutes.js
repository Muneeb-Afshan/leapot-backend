const express = require("express");
const upload = require("../controller/course/FileUpload");
const courseRouter = express.Router();

const {createCourse ,fetchCourses , addCourseDetails , fetchCoursesWithDetails , fetchAllCoursesWithDetails , logicalDeleteCourse , createCourseById, addCoursePage, getAllCourseBuilderPages, getTemplatesByCourseId} = require('../controller/course/CourseController');

const {addMessage, getMessages, thumbUp, thumbDown} = require('../controller/course/CourseDiscussion');
const {saveOrUpdateCourseBasicSetting , saveOrUpdateCourseAppearanceSetting} = require('../controller/course/CourseSettingController');

const {registerLearner , fetchRegisterLearnerById} = require('../controller/course/RegistrationController');
const {uploadVideo ,bannerImage} =require('../controller/fileUpload/uploadFileController')
const { createQuiz } = require("../controller/course/CourseQuizController");

//  const {  addCourseDetails , getAllCourses} = require('../controller/course/CourseController');
const verifyToken = require('../middleware/TokenVerifyMiddleware');


courseRouter.post('/event/eventRegistration',registerLearner);
courseRouter.get('/event/fetchRegisterLearnerById',fetchRegisterLearnerById);

courseRouter.post('/course/createCourse',createCourse);
courseRouter.post('/course/createCourseById',createCourseById);
courseRouter.post('/course/addCourseDetails',addCourseDetails);
courseRouter.get('/course/fetchCourses',fetchCourses);
courseRouter.get('/course/fetchCoursesWithDetails',fetchCoursesWithDetails);
courseRouter.get('/course/fetchAllCoursesWithDetails',fetchAllCoursesWithDetails);
courseRouter.put('/course/logicalDeleteCourse/:id',logicalDeleteCourse);
courseRouter.post('/course/uploadVideo',uploadVideo);
courseRouter.post('/course/bannerImage',bannerImage);


courseRouter.post('/course/saveOrUpdateCourseBasicSetting',saveOrUpdateCourseBasicSetting);
courseRouter.post('/course/saveOrUpdateCourseAppearanceSetting',saveOrUpdateCourseAppearanceSetting);





courseRouter.post('/course/addMessage',addMessage);
courseRouter.get('/course/:courseId',getMessages);
courseRouter.put('/course/messages/:messageId/thumbDown', thumbDown);
courseRouter.put('/course/messages/:messageId/thumbUp', thumbUp);
courseRouter.post('/course/quizzes', createQuiz);


courseRouter.post("/course/addcoursepage", addCoursePage);

courseRouter.get("/course/pages/getAllCourseBuilderPages", getAllCourseBuilderPages);
courseRouter.get("/course/getTemplatesByCourseId/:courseId", getTemplatesByCourseId);

module.exports = courseRouter;
