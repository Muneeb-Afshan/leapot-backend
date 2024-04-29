const UtilityRoutes = require("express").Router();
const {ContactForm , createFAQ , getAllFAQs , addRole, fetchRole} = require('../controller/utility/UtilityController')


UtilityRoutes.post("/addContactUs",ContactForm);
UtilityRoutes.post("/addFAQ",createFAQ);
UtilityRoutes.get("/FAQ",getAllFAQs);
UtilityRoutes.post('/role', addRole);
UtilityRoutes.get('/fetchRole', fetchRole);


module.exports = UtilityRoutes;