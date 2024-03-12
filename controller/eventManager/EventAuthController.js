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


const User = require("../../model/EMuserSchema");
const UserDetails = require('../../model/EMuserDetailSchema')
//All Authentications rest API are list here

// To add user, admin will add the user
const eventManagerSignUp = async (req, res) => {
  const { email, role } = req.body;
  if (!(email && role)) {
    return res.json({
      message: "all input feild require",
    });
  }
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.json({
      message: "Learner Allready Added in Database",
      success: false,
    });
  }

  const NewUser = new User({
    email: email,
    role: role,
  });
  NewUser.save();

  const NewUserDetails = new UserDetails({
    email: email,
    userid:NewUser._id
  });
  NewUserDetails.save();
  return res.status(201).json({
    message: "Learner Add successfull",
    success: true,
    statsCode:201
  });
};

// login user using google
const eventManagerSign = async (req, res) => {
  const { name, email, picture, email_verified, user_id } = req.user;
  try {
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      oldUser.username = name;
      oldUser.picture = picture;
      oldUser.email_verified = email_verified;
      oldUser.user_id = user_id;

      // Save the updated user document
      await oldUser.save();
      return res.status(200).json({
        user: oldUser,
        message: "User Login Successfull",
        statusCode : 200
      });
    } else {
      return res.json({
        message: "User not exit said admin to add you",
        statusCode : 400
      });
    }
  } catch (error) {
    return res.json({
      message: "Error Occurr During Login  ",
      error: error,
    });
  }
};

module.exports = {
    eventManagerSignUp,
    eventManagerSign,
};
