const routerUserDetails = require("express").Router();
const { GetUserProfileByEmail ,FindUsersDetails, updateUserStatusByEmail ,updateDeleteStatusByEmail,refreshToken} = require('../controller/userDetails/UserDetailsController')
const {getAllStatuses , createStatus} = require('../controller/userDetails/BlaclistedStatusTypeController')
const verifyToken = require('../middleware/TokenVerifyMiddleware');
routerUserDetails.post("/userProfile",verifyToken,GetUserProfileByEmail);
routerUserDetails.post("/refreshToken",refreshToken);
routerUserDetails.put('/updateUserstatus', updateUserStatusByEmail);
routerUserDetails.put('/updateDeleteStatus', updateDeleteStatusByEmail);
routerUserDetails.get("/FindUserDetails",FindUsersDetails);
routerUserDetails.get("/fetchBlacklistedStatusType",getAllStatuses);
routerUserDetails.post("/addBlacklistedStatusType",createStatus);



module.exports = routerUserDetails;