const UtilityRoutes = require("express").Router();
const verifyToken = require('../middleware/TokenVerifyMiddleware');


const {ContactForm , createFAQ , getAllFAQs , addRole, fetchRole} = require('../controller/utility/UtilityController')
const {uploadImages , uploadResume, uploadAttachments} =require('../controller/fileUpload/uploadFileController')



UtilityRoutes.post("/addContactUs",ContactForm);
UtilityRoutes.post("/addFAQ",createFAQ);
UtilityRoutes.get("/FAQ",getAllFAQs); 
UtilityRoutes.post('/role',verifyToken, addRole);
UtilityRoutes.get('/fetchRole',verifyToken, fetchRole);
UtilityRoutes.post('/upload',uploadImages );
UtilityRoutes.post('/uploadResume',uploadResume );
UtilityRoutes.post('/uploadAttachments',uploadAttachments );


module.exports = UtilityRoutes;

