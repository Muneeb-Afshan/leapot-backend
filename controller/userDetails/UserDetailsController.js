
const UserDetails = require('../../model/UserDetailsSchema')
const User = require('../../model/UserSchema');

exports.GetUserProfileByEmail = async (req, res) => {
  const { 
    email, firstname, lastname, dateofbirth, bio, country, state, countryCode, city, 
    address1, address2, phoneNo, picture, langCode 
  } = req.user;

  console.log(req.user.email);

  try {
    const oldDetails = await UserDetails.findOne({ email: email }).populate('userid');

    if (oldDetails) {
      // Update the user profile with provided details
      oldDetails.bio = bio ?? oldDetails.bio;
      oldDetails.userid.firstname = firstname ?? oldDetails?.userid?.firstname;
      oldDetails.userid.lastname = lastname ?? oldDetails?.userid?.lastname;
      oldDetails.userid.phoneNo = phoneNo ?? oldDetails?.userid?.phoneNo;
      oldDetails.userid.picture = picture ?? oldDetails?.userid?.picture;
      oldDetails.userid.profile_complete = true;

      oldDetails.dateofbirth = dateofbirth ?? oldDetails?.dateofbirth;
      oldDetails.country = country ?? oldDetails?.country;
      oldDetails.state = state ?? oldDetails?.state;
      oldDetails.city = city ?? oldDetails?.city;
      oldDetails.countryCode = countryCode ?? oldDetails?.countryCode; // Update countryCode

      oldDetails.address1 = address1 ?? oldDetails?.address1;
      oldDetails.address2 = address2 ?? oldDetails?.address2;
      oldDetails.langCode = langCode ?? oldDetails?.langCode;

      // Save the updated user details
      await oldDetails.save();
      await oldDetails.userid.save();

      console.log("USER", oldDetails);
      return res.status(200).json({
        user: oldDetails,
        message: "User profile updated successfully",
        statusCode: 200
      });
    } else {
      return res.status(400).json({
        user: oldDetails,
        message: "Error: User not found",
        statusCode: 400
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.FindUsersDetails = async (req, res) => {
  try {
    const oldDetails = await UserDetails.find().populate("userid");
    if (oldDetails) {
      return res
        .status(200)
        .json({ userDetails: oldDetails, message: "User Find Successfully" });
    } else {
      return res.status(500).json({ massage: "there is no user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateUserStatusByEmail = async (req, res) => {
  try {
    // const email = req.params.email;
    const { userStatus, email } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { userStatus },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateDeleteStatusByEmail = async (req, res) => {
  try {
    console.log("hii delete");
    // const email = req.params.email;
    const { deleteStatus, email } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { deleteStatus },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.refreshToken=async (req, res) => {
  try {
    const { refreshToken } = req.body;  // Get the refresh token from the request body

    // Validate the refresh token (e.g., using Firebase Admin SDK)
    // For demonstration, assuming you have a function `verifyRefreshToken` for this purpose
    const decodedToken = await admin.auth().verifyIdToken(refreshToken);

    // Generate a new access token
    const newToken = await generateNewAccessToken(decodedToken.uid);

    // Optionally, generate and return a new refresh token
    // const newRefreshToken = await generateNewRefreshToken(decodedToken.uid);

    res.json({ token: newToken });

  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
}

// Dummy function for generating a new access token
const generateNewAccessToken = async (uid) => {
  // Generate a new access token using Firebase Admin SDK
  return admin.auth().createCustomToken(uid);
};