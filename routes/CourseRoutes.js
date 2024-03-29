const express = require('express');
const courseRouter = express.Router();
// const {createLesson} = require('../controller/course/CourseController');
const {registerLearner} = require('../controller/course/RegistrationController');


// courseRouter.post('/eventDetails/:eventId/lessons', createLesson);
// courseRouter.post('/eventDetails',createEvent);
courseRouter.post('/event/eventRegistration',registerLearner);

module.exports = courseRouter;
