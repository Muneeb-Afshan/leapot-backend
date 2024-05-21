const UtilityRoutes = require("express").Router();

const {ContactForm , createFAQ , getAllFAQs , addRole, fetchRole} = require('../controller/utility/UtilityController')
const {uploadImages , uploadResume} =require('../controller/fileUpload/uploadFileController')


UtilityRoutes.post("/addContactUs",ContactForm);
UtilityRoutes.post("/addFAQ",createFAQ);
UtilityRoutes.get("/FAQ",getAllFAQs); 
UtilityRoutes.post('/role', addRole);
UtilityRoutes.get('/fetchRole', fetchRole);
UtilityRoutes.post('/upload',uploadImages );
UtilityRoutes.post('/uploadResume',uploadResume );


module.exports = UtilityRoutes;