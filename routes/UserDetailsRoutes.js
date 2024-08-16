const routerUserDetails = require("express").Router();
const { GetUserProfileByEmail ,FindUsersDetails, updateUserStatusByEmail ,updateDeleteStatusByEmail} = require('../controller/userDetails/UserDetailsController')
const {getAllStatuses , createStatus} = require('../controller/userDetails/BlaclistedStatusTypeController')
const verifyToken = require('../middleware/TokenVerifyMiddleware');
routerUserDetails.post("/userProfile",GetUserProfileByEmail);
routerUserDetails.put('/updateUserstatus', updateUserStatusByEmail);
routerUserDetails.put('/updateDeleteStatus', updateDeleteStatusByEmail);
routerUserDetails.get("/FindUserDetails",FindUsersDetails);
routerUserDetails.get("/fetchBlacklistedStatusType",getAllStatuses);
routerUserDetails.post("/addBlacklistedStatusType",createStatus);



module.exports = routerUserDetails;