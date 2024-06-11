const express = require("express");
const usermoduleRouter = express.Router();
const {
  createUser,
  fetchUser,
  fetchUsersByRole,
  passwordResetLink,
  updateUserProfile,
  logicalUserDelete,
  fetchUserById,
  csvCreateUser,
} = require("../controller/usermodule/usermoduleController");

const {
  addProfileImage,
} = require("../controller/usermodule/UploadProfileImageController");

const {
  logAction,
  getUserActions,
} = require("../controller/usermodule/UserActionController");

usermoduleRouter.post("/usermodule/createnewusers", createUser);
usermoduleRouter.get("/usermodule/getusersdetails", fetchUser);
usermoduleRouter.get("/usermodule/getusersdetails/:role", fetchUsersByRole);
usermoduleRouter.post("/usermodule/passwordResetLink", passwordResetLink);
usermoduleRouter.put("/usermodule/deleteUser/:id", logicalUserDelete);
usermoduleRouter.get("/usermodule/getUserdetails/:id", fetchUserById);
usermoduleRouter.post("/usermodule/usersCsv", csvCreateUser);
usermoduleRouter.put("/usermodule/updateUserProfile/:id", updateUserProfile);
usermoduleRouter.post("/usermodule/addprofilepicture", addProfileImage);
usermoduleRouter.post("/usermodule/logAction", logAction);
usermoduleRouter.get("/usermodule/userActions/:userid", getUserActions);

module.exports = usermoduleRouter;
