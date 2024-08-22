const express = require("express");
const path = require("path");
const usermoduleRouter = express.Router();
const UserHistory = require("../model/UserHistorySchema");

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
const { verifyOTP, sendOTP } = require("../controller/otpController");

usermoduleRouter.post("/usermodule/createnewusers", createUser);
usermoduleRouter.post("/usermodule/verifyotp",verifyOTP);
usermoduleRouter.post("/usermodule/sendotp",sendOTP);
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

usermoduleRouter.get(
  "/usermodule/download/successful/:timeOfAction",
  async (req, res) => {
    try {
      const { timeOfAction } = req.params;

      // Retrieve the file path based on TimeofAction
      const userHistory = await UserHistory.findOne({
        TimeofAction: timeOfAction,
      });
      if (!userHistory || !userHistory.SuccessFilePath) {
        return res.status(404).json({ error: "File not found" });
      }

      const filePath = path.join(__dirname, "..", userHistory.SuccessFilePath);
      console.log("File path:", filePath);
      res.download(
        filePath,
        `successfulUserRecords_${timeOfAction}.csv`,
        (err) => {
          if (err) {
            console.error("Error downloading the file:", err);
            res.status(500).send("Internal Server Error");
          }
        }
      );
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Endpoint to download failure user records

usermoduleRouter.get(
  "/usermodule/download/failure/:timeOfAction",
  async (req, res) => {
    try {
      const { timeOfAction } = req.params;

      // Retrieve the file path based on TimeofAction
      const userHistory = await UserHistory.findOne({
        TimeofAction: timeOfAction,
      });
      if (!userHistory || !userHistory.FailureFilePath) {
        return res.status(404).json({ error: "File not found" });
      }

      const filePath = path.join(__dirname, "..", userHistory.FailureFilePath);
      console.log("File path:", filePath);
      res.download(
        filePath,
        `failureUserRecords_${timeOfAction}.csv`,
        (err) => {
          if (err) {
            console.error("Error downloading the file:", err);
            res.status(500).send("Internal Server Error");
          }
        }
      );
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = usermoduleRouter;
