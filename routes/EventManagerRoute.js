const express = require('express');
const eventManagerRouter = express.Router();
//controller added here
const {createEvent , fetchEvent,fetchEventById,updateEvent,logicalEventDelete ,csvCreateEvent } = require('../controller/eventManager/EventController');
const {createUser ,fetchUser ,logicalUserDelete , fetchUserById ,updateUserById , addInstructure ,getInstructor}  = require('../controller/eventManager/EventUserController')
const {eventManagerSignUp , eventManagerSign}  = require("../controller/eventManager/EventAuthController")

// Event Manager Authentication Routes 
eventManagerRouter.post('/eventManager/signUp', eventManagerSignUp);
eventManagerRouter.get('/eventManager/signIn', eventManagerSign);

//event related routes 
eventManagerRouter.post('/eventManager/createEvent', createEvent);
eventManagerRouter.get('/eventManager/getEvents',fetchEvent);
eventManagerRouter.get('/eventManager/getEventById/:id',fetchEventById);
eventManagerRouter.put('/eventManager/updateEvent/:id',updateEvent);
eventManagerRouter.patch('/eventManager/deleteEvent/:id',logicalEventDelete);
eventManagerRouter.post('/eventManager/csvcreateEvent',csvCreateEvent);

// user related routes
eventManagerRouter.post('/eventManager/users', createUser);
eventManagerRouter.get('/eventManager/getUsers',fetchUser);
eventManagerRouter.delete('/eventManager/deleteUser/:id',logicalUserDelete);
eventManagerRouter.get('/eventManager/getUser/:id',fetchUserById);
eventManagerRouter.put('/eventManager/updateUser/:id',updateUserById);
eventManagerRouter.post('/eventManager/addInstructor', addInstructure);
eventManagerRouter.get('/eventManager/getInstructor', getInstructor);

module.exports = eventManagerRouter;