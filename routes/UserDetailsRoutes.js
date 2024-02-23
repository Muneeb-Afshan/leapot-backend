const routerUserDetails = require("express").Router();
const { GetUserProfileByEmail ,FindUsersDetails, updateUserStatusByEmail ,updateDeleteStatusByEmail} = require('../controller/UserDetailsController')

routerUserDetails.post("/userProfile",GetUserProfileByEmail);
routerUserDetails.put('/updateUserstatus', updateUserStatusByEmail);
routerUserDetails.put('/updateDeleteStatus', updateDeleteStatusByEmail);
routerUserDetails.get("/FindUserDetails",FindUsersDetails);

module.exports = routerUserDetails;