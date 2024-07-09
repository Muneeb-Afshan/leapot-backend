const UtilityRoutes = require("express").Router();
const verifyToken = require("../middleware/TokenVerifyMiddleware");

const {
  ContactForm,
  createFAQ,
  getAllFAQs,
  addRole,
  fetchRole,
  fetchEmail
} = require("../controller/utility/UtilityController");
const {
  uploadImages,
  uploadResume,
  uploadAttachments,
  uploadscrom,
  uploadUserImages,
} = require("../controller/fileUpload/uploadFileController");

// const {
//   uploadscorm
// } = require('../controller/fileUpload/uploadscorm');

UtilityRoutes.post("/addContactUs", ContactForm);
UtilityRoutes.post("/addFAQ", createFAQ);
UtilityRoutes.get("/FAQ", getAllFAQs);
UtilityRoutes.post("/role", verifyToken, addRole);
UtilityRoutes.post("/role", verifyToken, addRole);
UtilityRoutes.get("/fetchRole", fetchRole);
UtilityRoutes.post("/upload", uploadImages);
UtilityRoutes.post("/uploadResume", uploadResume);
UtilityRoutes.post("/uploadAttachments", uploadAttachments);
UtilityRoutes.post("/uploadUserImages", uploadUserImages);
UtilityRoutes.post("/uploadscrom", uploadscrom);
UtilityRoutes.get("/fetchEmail", fetchEmail);

module.exports = UtilityRoutes;
