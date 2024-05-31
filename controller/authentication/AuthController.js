const User = require("../../model/UserSchema");
const UserDetails = require("../../model/UserDetailsSchema");
//All Authentications rest API are list here

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
    return res.json({
      message: "Error Occurr During Login  ",
      error: error,
    });
  }
};

const loginWithEmail = async (req, res) => {
  const { email } = req.user;
  try {
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await UserDetails.findOne({ email: email }).populate(
      "userid"
    );
    if (oldUser) {
      // Save the updated user document
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
    return res.json({
      message: "Error Occurr During Login  ",
      error: error,
    });
  }
};

const logout = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.lastSignOut = new Date();

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
};
