const UtilityRoutes = require("express").Router();
const {ContactForm , createFAQ , getAllFAQs} = require('../controller/utility/UtilityController')

UtilityRoutes.post("/addContactUs",ContactForm);
UtilityRoutes.post("/addFAQ",createFAQ);
UtilityRoutes.get("/FAQ",getAllFAQs);




module.exports = UtilityRoutes;