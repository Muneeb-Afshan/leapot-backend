// importing all controller 
const {register , login} = require('../controller/authentication/AuthController')
const auth = require('../middleware/AuthMiddleware');
// const LoggingMiddleware = require('../middleware/LoggingMiddleware');
const apicache = require('apicache');
const cache = apicache.middleware;
// Initialise router 
const router = require("express").Router();
//router with endpoint and controller
router.get("/login",auth,login);
router.post("/register",register);

module.exports = router;