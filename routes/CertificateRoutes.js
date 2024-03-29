const express = require('express');
const certificateRouter = express.Router();
const {createCertificateSetting} = require('../controller/certificate/CourseSettingController');
const {addTemplate , useTemplate , editTemplate , getAllTemplates , getAllCertificate, getOriantation , singleIssue , bulkIssue, fetchIssueCertificate ,fetchSetting, blacklistUsers ,getBlacklistedUsers} = require('../controller/certificate/CertificateDesign')
// Route to save a new certificate setting
certificateRouter.post('/certificate/certificateSettings',createCertificateSetting);
certificateRouter.post('/certificate/addTemplate',addTemplate);
certificateRouter.post('/certificate/useTemplate',useTemplate);
certificateRouter.put('/certificate/editTemplate/:id',editTemplate);
certificateRouter.get('/certificate/fetchTemplate',getAllTemplates);
certificateRouter.get('/certificate/fetchCertificates',getAllCertificate);
certificateRouter.get('/certificate/getOriantation',getOriantation);
certificateRouter.post('/certificate/singleIssue',singleIssue);
certificateRouter.get('/certificate/fetchSetting',fetchSetting);
certificateRouter.post('/certificate/bulkIssue',bulkIssue);
certificateRouter.get('/certificate/fetchIssueCertificate',fetchIssueCertificate);
certificateRouter.post('/certificate/blacklist', blacklistUsers);
certificateRouter.get('/certificate/getBlacklistedUsers', getBlacklistedUsers);









module.exports = certificateRouter;