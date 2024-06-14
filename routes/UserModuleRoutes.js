const express = require("express");
const path = require('path');
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

const {
  getUserHistory,
  createImportHistory,
} = require("../controller/usermodule/UserHistoryController");
    

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
usermoduleRouter.post("/usermodule/postuserhistory", createImportHistory);
usermoduleRouter.get("/usermodule/getuserhistory", getUserHistory);

// Endpoint to download successful user records
usermoduleRouter.get("/usermodule/download/successful", (req, res) => {
  const filePath = path.join(__dirname, "../successfulUserRecords.csv");
  console.log("File path:", filePath); 
  res.download(filePath, "successfulUserRecords.csv", (err) => {
    if (err) {
      console.error("Error downloading the file:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

// Endpoint to download failure user records
usermoduleRouter.get("/usermodule/download/failure", (req, res) => {
  const filePath = path.join(__dirname, "../failureUserRecords.csv");
  console.log("File path:", filePath); 
  res.download(filePath, "failureUserRecords.csv", (err) => {
    if (err) {
      console.error("Error downloading the file:", err);
      res.status(500).send("Internal Server Error routes");
    }
  });
});

module.exports = usermoduleRouter;
