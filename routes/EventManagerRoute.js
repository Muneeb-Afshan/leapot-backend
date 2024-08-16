const express = require("express");
const eventManagerRouter = express.Router();
const auth = require("../middleware/AuthMiddleware");
const apicache = require("apicache");
const cache = apicache.middleware;
const verifyToken = require('../middleware/TokenVerifyMiddleware');
//controller added here

const {
  createEvent,
  fetchEvent,
  fetchEventName,
  fetchEventById,
  updateEvent,
  logicalEventDelete,
  csvCreateEvent,
} = require("../controller/eventManager/EventController");
const {
  passwordResetLink,
  createUser,
  fetchUser,
  logicalUserDelete,
  logicalAllUserDelete,
  fetchUserById,
  updateUserById,
  addInstructure,
  getInstructor,
  emailTest,
} = require("../controller/eventManager/EventUserController");
const {
  eventManagerSignUp,
  eventManagerSign,
} = require("../controller/eventManager/EventAuthController");
const {
  eventType,
  createEventType,
  createMemberType,
  fetchMemberType,
  createDeliveryMethod,
  fetchDeliveryMethod,
  createEventAffiliation,
  fetchEventAffiliation,
  createEventAccessibility,
  fetchEventAccessibility,
} = require("../controller/eventManager/EventUtilityController");

// Event Manager Authentication Routes
eventManagerRouter.post("/eventManager/signUp", eventManagerSignUp);
eventManagerRouter.get("/eventManager/signIn", auth, eventManagerSign);

//event related routes
eventManagerRouter.post("/eventManager/createEvent", createEvent);
eventManagerRouter.get("/eventManager/getEvents",verifyToken, fetchEvent);//FIXME:
eventManagerRouter.get("/eventManager/getEventsName", fetchEventName);

eventManagerRouter.get("/eventManager/getEventById/:id", fetchEventById);
eventManagerRouter.put("/eventManager/updateEvent/:id", updateEvent);
eventManagerRouter.patch("/eventManager/deleteEvent/:id", logicalEventDelete);
eventManagerRouter.post("/eventManager/csvcreateEvent", csvCreateEvent);
eventManagerRouter.post("/eventManager/createEventType", createEventType);
eventManagerRouter.get("/eventManager/eventType", eventType);
eventManagerRouter.post("/eventManager/createMemberType", createMemberType);
eventManagerRouter.get("/eventManager/fetchMemberType", fetchMemberType);
eventManagerRouter.post(
  "/eventManager/createDeliveryMethod",
  createDeliveryMethod
);
eventManagerRouter.get(
  "/eventManager/fetchDeliveryMethod",
  fetchDeliveryMethod
);
eventManagerRouter.post(
  "/eventManager/createEventAffiliation",
  createEventAffiliation
);
eventManagerRouter.get(
  "/eventManager/fetchEventAffiliation",
  fetchEventAffiliation
);
eventManagerRouter.post(
  "/eventManager/createEventAccessibility",
  createEventAccessibility
);
eventManagerRouter.get(
  "/eventManager/fetchEventAccessibility",
  fetchEventAccessibility
);

// user related routes
eventManagerRouter.post("/eventManager/passwordResetLink", passwordResetLink);
eventManagerRouter.post("/eventManager/users", createUser);
eventManagerRouter.get("/eventManager/getUsers",verifyToken, fetchUser);//FIXME:
eventManagerRouter.put("/eventManager/deleteUser/:id", logicalUserDelete);
eventManagerRouter.delete("/eventManager/deleteAllUser/", logicalAllUserDelete);
eventManagerRouter.get("/eventManager/getUser/:id", fetchUserById);
eventManagerRouter.put("/eventManager/updateUser/:id", updateUserById);
eventManagerRouter.post("/eventManager/addInstructor", addInstructure);
eventManagerRouter.get("/eventManager/getInstructor", getInstructor);
eventManagerRouter.get("/eventManager/sendDemoMail", emailTest);

module.exports = eventManagerRouter;
