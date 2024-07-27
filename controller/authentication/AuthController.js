const admin = require('firebase-admin');

const User = require("../../model/UserSchema");
const UserDetails = require("../../model/UserDetailsSchema");
//All Authentications rest API are list here
const loginWithGoogle = async (req, res) => {
  const { token } = req.body;
console.log("inauth controller for google",req.body);
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    // Verify the token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;

    // Check if user exists in the database
    const user = await User.findOne({ email });

    if (user) {
      // User exists in the database
      return res.status(200).json({
        user: {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          picture: user.picture,
          user_id: user.user_id,
          role: user.role,
          lastLogin: user.lastLogin 

        },
        message: 'User login successful',
      });
    } else {
      // User does not exist
      return res.status(404).json({
        message: 'User does not exist. Contact admin to add you.',
      });
    }
  } catch (error) {
    console.error('Error verifying token or checking user existence:', error);
    res.status(500).send('Internal Server Error');
  }
};

// To add user, admin will add the user
const register = async (req, res) => {
  const { email, role, password } = req.body;
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
    userid: NewUser._id,
  });
  NewUserDetails.save();
  return res.status(201).json({
    message: "Learner Add successfull",
    success: true,
    statsCode: 201,
  });
};

// login user using google
const login = async (req, res) => {
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
      });
    } else {
      return res.json({
        message: "User not exit said admin to add you",
      });
    }
  } catch (error) {
    console.log("errorrrrrrrrrrrrrrrrrrrrrrrr  ", error.message);
    return res.json({
      message: "Error occured while login with gmail.",
      error: error,
    });
  }
};

const loginWithEmail = async (req, res) => {
  const { email } = req.user;
  try {
    // Check if user exists in UserDetails
    const userDetails = await UserDetails.findOne({ email: email }).populate('userid');
    if (userDetails) {
      // Fetch the related user document
      const user = await User.findById(userDetails.userid);
      if (user) {
      return res.status(200).json({
          user: {
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            picture: user.picture,
            user_id: user.user_id,
            role: user.role,
            lastLogin: user.lastLogin, 
          },
          message: "User Login Successful",
        });
      } else {
        return res.status(404).json({
          message: "User details exist but user not found!",
        });
      }
    } else {
      return res.status(404).json({
        message: "User doesn't exist! Contact admin for account creation",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred during login.",
      error: error,
    });
  }
};


const logout = async (req, res) => {
  const { email } = req.body; // Ensure the email is being sent in the request body

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.lastLogin = new Date();

    await user.save();

    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
module.exports = {
  register,
  login,
  loginWithEmail,
  logout,
  loginWithGoogle
};
