const routerMyProfile = require("express").Router();
const {
  GetUserProfileByEmail,
  FindUsersDetails,
  updateUserStatusByEmail,
  updateDeleteStatusByEmail,
} = require("../controller/userDetails/UserDetailsController");

routerMyProfile.post("/userProfilelms", GetUserProfileByEmail);
routerMyProfile.put("/updateUserstatuslms", updateUserStatusByEmail);
routerMyProfile.put("/updateDeleteStatuslms", updateDeleteStatusByEmail);
routerMyProfile.get("/FindUserDetailslms", FindUsersDetails);

module.exports = routerMyProfile;
