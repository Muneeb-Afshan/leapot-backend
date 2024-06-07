const express = require('express');
const certificateRouter = express.Router();
const verifyToken = require('../middleware/TokenVerifyMiddleware');

const {createCertificateSetting , updateCertificateSetting} = require('../controller/certificate/CourseSettingController');
const {addTemplate , logicalDeleteTemplate ,  useTemplate , editCertificate , logicalDeleteCertificate , getAllTemplates , getAllCertificate,getSingleCertificate, getOriantation , singleIssue , bulkIssue, fetchIssueCertificate ,fetchSetting,fetchSingleSetting, DeleteSettingOfEvent ,blacklistUsers ,getBlacklistedUsers} = require('../controller/certificate/CertificateDesign')
// Route to save a new certificate setting
certificateRouter.post('/certificate/certificateSettings',verifyToken,createCertificateSetting); //
certificateRouter.put('/certificate/updateCertificateSetting/:id',updateCertificateSetting); //

certificateRouter.post('/certificate/addTemplate',verifyToken, addTemplate); //
certificateRouter.put('/certificate/deleteTemplate/:id',logicalDeleteTemplate); //
certificateRouter.post('/certificate/useTemplate',verifyToken,useTemplate); //
certificateRouter.put('/certificate/editCertificate/:id',editCertificate); //
certificateRouter.put('/certificate/deleteCertificate/:id',logicalDeleteCertificate); //
certificateRouter.get('/certificate/fetchTemplate',getAllTemplates); //
certificateRouter.get('/certificate/fetchCertificates',getAllCertificate); //
certificateRouter.get('/certificate/fetchSingleCertificate/:id',getSingleCertificate); //
certificateRouter.get('/certificate/getOriantation',getOriantation); //
certificateRouter.post('/certificate/singleIssue',verifyToken,singleIssue); //
certificateRouter.get('/certificate/fetchSetting',fetchSetting); //
certificateRouter.get('/certificate/fetchSingleSetting/:id',fetchSingleSetting);
certificateRouter.put('/certificate/DeleteEventSetting/:id',DeleteSettingOfEvent); 
certificateRouter.post('/certificate/bulkIssue',verifyToken,bulkIssue);
certificateRouter.get('/certificate/fetchIssueCertificate',fetchIssueCertificate); //
certificateRouter.post('/certificate/blacklist',verifyToken, blacklistUsers); //
certificateRouter.get('/certificate/getBlacklistedUsers', getBlacklistedUsers); //









module.exports = certificateRouter;