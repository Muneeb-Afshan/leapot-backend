// importing all controller
const {
  register,
  login,
  loginWithEmail,
  logout,
  loginWithGoogle,
} = require("../controller/authentication/AuthController");
const auth = require("../middleware/AuthMiddleware");
// const LoggingMiddleware = require('../middleware/LoggingMiddleware');
const apicache = require("apicache");
const cache = apicache.middleware;
// Initialise router
const router = require("express").Router();
//router with endpoint and controller
router.get("/login", auth, login);
router.post('/auth/login', loginWithGoogle);
router.post("/register", register);
router.post("/loginWithEmail", auth, loginWithEmail);
router.post("/logout", logout);

module.exports = router;
