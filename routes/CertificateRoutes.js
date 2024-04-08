const express = require('express');
const certificateRouter = express.Router();
const {createCertificateSetting} = require('../controller/certificate/CourseSettingController');
const {addTemplate , logicalDeleteTemplate ,  useTemplate , editCertificate , logicalDeleteCertificate , getAllTemplates , getAllCertificate,getSingleCertificate, getOriantation , singleIssue , bulkIssue, fetchIssueCertificate ,fetchSetting,fetchSingleSetting, DeleteSettingOfEvent ,blacklistUsers ,getBlacklistedUsers} = require('../controller/certificate/CertificateDesign')
// Route to save a new certificate setting
certificateRouter.post('/certificate/certificateSettings',createCertificateSetting); 
certificateRouter.post('/certificate/addTemplate',addTemplate); //
certificateRouter.put('/certificate/deleteTemplate/:id',logicalDeleteTemplate); //
certificateRouter.post('/certificate/useTemplate',useTemplate); //
certificateRouter.put('/certificate/editCertificate/:id',editCertificate); //
certificateRouter.put('/certificate/deleteCertificate/:id',logicalDeleteCertificate); //
certificateRouter.get('/certificate/fetchTemplate',getAllTemplates); //
certificateRouter.get('/certificate/fetchCertificates',getAllCertificate); //
certificateRouter.get('/certificate/fetchSingleCertificate/:id',getSingleCertificate); //
certificateRouter.get('/certificate/getOriantation',getOriantation); //
certificateRouter.post('/certificate/singleIssue',singleIssue);
certificateRouter.get('/certificate/fetchSetting',fetchSetting); //
certificateRouter.get('/certificate/fetchSingleSetting/:id',fetchSingleSetting);
certificateRouter.put('/certificate/DeleteEventSetting/:id',DeleteSettingOfEvent); 
certificateRouter.post('/certificate/bulkIssue',bulkIssue);
certificateRouter.get('/certificate/fetchIssueCertificate',fetchIssueCertificate);
certificateRouter.post('/certificate/blacklist', blacklistUsers); //
certificateRouter.get('/certificate/getBlacklistedUsers', getBlacklistedUsers); //









module.exports = certificateRouter;