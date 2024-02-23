// importing all controller 
const {register , login} = require('../controller/AuthController')
const auth = require('../middleware/AuthMiddleware');
// const LoggingMiddleware = require('../middleware/LoggingMiddleware');

// Initialise router 
const router = require("express").Router();
//router with endpoint and controller
router.get("/login",auth,login);
router.post("/register",register);

module.exports = router;