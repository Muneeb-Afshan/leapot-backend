const express = require("express");
const certificateRouter = express.Router();
const verifyToken = require("../middleware/TokenVerifyMiddleware");
const {
  handleFileUpload,
  uploadFile,
} = require("../controller/certificate/uploadController");

const {
  createCertificateSetting,
  updateCertificateSetting,
} = require("../controller/certificate/CourseSettingController");
const {
  addTemplate,
  logicalDeleteTemplate,
  useTemplate,
  editCertificate,
  logicalDeleteCertificate,
  getAllTemplates,
  getAllCertificate,
  getSingleCertificate,
  singleIssue,
  bulkIssue,
  fetchIssueCertificate,
  fetchSetting,
  fetchSingleSetting,
  DeleteSettingOfEvent,
  blacklistUsers,
  GetBlacklistedCertificate,
  UpdateBlacklistedUsers,
  deleteblacklistUsers,
} = require("../controller/certificate/CertificateDesign");
// Route to save a new certificate setting
certificateRouter.post(
  "/certificate/certificateSettings",
  createCertificateSetting
);
certificateRouter.put(
  "/certificate/updateCertificateSetting/:id",
  updateCertificateSetting
);
// certificateRouter.post('/certificate/addTemplate',verifyToken, addTemplate);
certificateRouter.post("/certificate/addTemplate", addTemplate);
certificateRouter.put("/certificate/deleteTemplate/:id", logicalDeleteTemplate);
certificateRouter.post("/certificate/useTemplate", useTemplate);
certificateRouter.put("/certificate/editCertificate/:id", editCertificate);
certificateRouter.put(
  "/certificate/deleteCertificate/:id",
  logicalDeleteCertificate
);
certificateRouter.get("/certificate/fetchTemplate", getAllTemplates);
certificateRouter.get("/certificate/fetchCertificates", getAllCertificate);
certificateRouter.get(
  "/certificate/fetchSingleCertificate/:id",
  getSingleCertificate
);
certificateRouter.post("/certificate/singleIssue", singleIssue);
certificateRouter.get("/certificate/fetchSetting", fetchSetting);
certificateRouter.get(
  "/certificate/fetchSingleSetting/:id",
  fetchSingleSetting
);
certificateRouter.put(
  "/certificate/DeleteEventSetting/:id",
  DeleteSettingOfEvent
);
certificateRouter.post("/certificate/bulkIssue", bulkIssue);
certificateRouter.get(
  "/certificate/fetchIssueCertificate",
  fetchIssueCertificate
);
certificateRouter.post("/certificate/blacklist", blacklistUsers);
certificateRouter.put(
  "/certificate/deleteBlacklist/:email",
  deleteblacklistUsers
);
certificateRouter.get(
  "/certificate/GetBlacklistedCertificate",
  GetBlacklistedCertificate
);
certificateRouter.put(
  "/certificate/updateBlacklist/:email",
  UpdateBlacklistedUsers
);
certificateRouter.post("/upload", uploadFile, handleFileUpload);

module.exports = certificateRouter;
