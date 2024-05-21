const express = require("express");
const usermoduleRouter = express.Router();

usermoduleRouter.post("/usermodule/users", createUser);
usermoduleRouter.get("/usermodule/getUser/:id", fetchUserById);

module.exports = usermoduleRouter;
