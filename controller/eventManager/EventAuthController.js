// const RegisterModel = require ('../../model/RegisterForm')

// // Register User
// exports.eventManagerSignUp= async (req, res) => {
//     RegisterModel.create(req.body)
//     .then(register => res.json (register))
//     .catch(err => res.json(err))
// }

// exports.eventManagerSign = async (req, res) => {
//     const {email, password} = req.body;
//     RegisterModel.findOne({email: email})
//     .then(user => {
//         if (user){
//             if(user.password === password){
//                 res.json("Success")
//             }else{
//                 res.json("The Password is incorrect")
//             }
//         } else {
//             res.json("No record existed")
//         }
//      })
//     .catch(err => res.json(err))
// }

const User = require("../../model/UserSchema");
const UserDetails = require("../../model/UserDetailsSchema");
const UserAction = require("../../model/UserActionSchema");

//All Authentications rest API are list here

// To add user, admin will add the user
const eventManagerSignUp = async (req, res) => {
  const { email, role, password, username } = req.body;
  if (!(email && role)) {
    return res.json({
      message: "all input feild require",
    });
  }
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.json({
      message: "Learner Already Added in Database",
      success: false,
    });
  }

  const NewUser = new User({
    email: email,
    role: role,
    username: username,
  });
  NewUser.save();

  const NewUserDetails = new UserDetails({
    email: email,
    userid: NewUser._id,
  });
  NewUserDetails.save();
  return res.status(201).json({
    message: "Learner Add successfull",
    success: true,
    statsCode: 201,
  });
};

// Delete user route
// app.delete('/api/deleteuser', verifyToken, async (req, res) => {
//   try {
//     const uid = req.uid; // Extracting UID from the verified token

//     // Delete the user from Firebase Authentication
//     await firebase.auth().deleteUser(uid);

//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to delete user', error: error.message });
//   }
// });

// login user using google
const eventManagerSign = async (req, res) => {
  const { name, email, picture, email_verified, user_id } = req.user;
  try {
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await UserDetails.findOne({ email: email }).populate(
      "userid"
    );
    if (oldUser) {
      oldUser.userid.username = oldUser.userid.username ?? name;
      oldUser.userid.picture = oldUser.userid.picture ?? picture;
      oldUser.userid.email_verified = email_verified;
      oldUser.userid.user_id = user_id;

      // Update last login date
      oldUser.lastLogin = new Date();
      // Update signInCount for Learner role
      if (oldUser.userid.role === "Learner") {
        oldUser.userid.learnerDetails.signInCount += 1;
        oldUser.userid.learnerDetails.lastSignIn = new Date();
      }

      // Save the updated user document
      await oldUser.userid.save();

      // Find the existing UserAction document for login action
      let userAction = await UserAction.findOne({
        userid: oldUser.userid._id,
        action: "login",
      });

      if (userAction) {
        // Update the actionTime
        userAction.actionTime = new Date();
      } else {
        // Create a new UserAction document if it doesn't exist
        userAction = new UserAction({
          userid: oldUser.userid._id,
          action: "login",
          remarks: "Successful login",
          actionTime: new Date(),
        });
      }

      // Save the UserAction document
      await userAction.save();

      return res.status(200).json({
        user: oldUser,
        message: "User Login Successfull",
        statusCode: 200,
      });
    } else {
      return res.json({
        message: "User not exit said admin to add you",
        statusCode: 400,
      });
    }
  } catch (error) {
    console.log("errorrrrrrrrrrrrrrrrrrrrrrrr  ", error.message);
    return res.json({
      message: "Error occured during login.",
      error: error,
    });
  }
};

module.exports = {
  eventManagerSignUp,
  eventManagerSign,
};
