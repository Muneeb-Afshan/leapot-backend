const UtilityRoutes = require("express").Router();
const {ContactForm , createFAQ , getAllFAQs , addRole} = require('../controller/utility/UtilityController')



UtilityRoutes.post("/addContactUs",ContactForm);
UtilityRoutes.post("/addFAQ",createFAQ);
UtilityRoutes.get("/FAQ",getAllFAQs);
UtilityRoutes.post('/role', addRole);


module.exports = UtilityRoutes;