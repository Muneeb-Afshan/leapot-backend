const InstructorModel = require("../../model/Instructor");
const User = require("../../model/UserSchema");
const UserDetails = require("../../model/UserDetailsSchema");
//All Authentications rest API are list here
const { sendEmail } = require("../emailUtility/SendEmailFunction");
const firebase = require("firebase-admin");
const nodemailer = require("nodemailer");
const transporter = require("../emailUtility/SendEmailFunction");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// To add user, admin will add the user
exports.createUser = async (req, res) => {
  const { firstname, lastname, email, role, password, referredBy } = req.body;

  if (!(email && role)) {
    return res.json({
      message: "All input fields are required",
    });
  }

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.json({
      message: "User already exists in the database",
      success: false,
    });
  }

  try {
    // Create user in Firebase
    const userRecord = await firebase.auth().createUser({
      email,
      password,
    });

    // Send email verification link
    await firebase
      .auth()
      .generateEmailVerificationLink(email)
      .then((link) => {
        console.log("Verification email link:", link);
        // You can send this link to the user via email if needed
      });

    // Generate password reset link
    const passwordResetLink = await firebase
      .auth()
      .generatePasswordResetLink(email);
    console.log("Password reset link email:", passwordResetLink);

    // Send email with password reset link
    await transporter.sendEmail({
      from: "contact@leapot.in",
      to: email,
      subject: "Password Reset Link For Account",
      html: `
          <p>You are receiving this email because a request was made to reset the password for your account.</p>
          <p><a href="${passwordResetLink}" style="background-color: green; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        `,
    });

    // Create user in MongoDB
    const newUser = new User({
      firstname: firstname,
      lastname: lastname,
      email: userRecord.email,
      role: role,
      user_id: userRecord.uid,
    });
    // If the role is 'Learner', add referredBy to learnerDetails
    if (role === "Learner") {
      newUser.learnerDetails = { referredBy };
    }

    await newUser.save();

    // Create user details in MongoDB
    const newUserDetails = new UserDetails({
      email: email,
      userid: newUser._id,
    });
    await newUserDetails.save();

    await newUser.save();

    // If the role is Instructor, add to the Instructor model
    if (role === "Instructor") {
      const newInstructor = new InstructorModel({
        email: email,
        userid: newUser._id,
        firstname: firstname,
        lastname: lastname,
      });
      await newInstructor.save();
    }

    return res.status(201).json({
      data: newUser,
      message: "User added successfully",
      success: true,
      statusCode: 201,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//fetching the users details
exports.fetchUser = async (req, res) => {
  try {
    const users = await User.find({ deleteStatus: false });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};

// Controller function to fetch users based on role
exports.fetchUsersByRole = async (req, res) => {
  const { role } = req.params;

  if (!role) {
    return res.status(400).json({ error: "Role parameter is required" });
  }

  try {
    const users = await User.find({ role: role, deleteStatus: false });
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found with the specified role" });
    }
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users by role:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching users by role" });
  }
};

//controleer to reset passsword for your account
exports.passwordResetLink = async (req, res) => {
  const { email } = req.body;
  console.log("email", req.body);
  console.log("email", email);

  try {
    const passwordResetLink = await firebase
      .auth()
      .generatePasswordResetLink(email);
    console.log("passwordResetLink email :", passwordResetLink);

    // Send email with password reset link
    await transporter.sendEmail({
      from: "intern.lpt@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `
    <p>You are receiving this email because a request was made to reset the password for your account.</p>
    <p>Please follow these steps to reset your password:</p>
    <p><a href="${passwordResetLink}" style="background-color: green; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
  `,
    });
    res.json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.json({ success: false });
  }
};

//controller to update user profile
exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, phoneNo, picture, role } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Update fields only if new data is provided
    user.firstname = firstname ?? user.firstname;
    user.lastname = lastname ?? user.lastname;
    user.phoneNo = phoneNo ?? user.phoneNo;
    user.picture = picture ?? user.picture;
    user.role = role ?? user.role;

    // Save the updated user
    await user.save();

    return res.status(200).json({
      user,
      message: "User profile updated successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};
//controller to logically delete user
exports.logicalUserDelete = async (req, res) => {
  try {
    const id = req.params.id;

    // Delete user from User table
    const deleteUser = await User.findByIdAndUpdate(
      id,
      { deleteStatus: true },
      { new: true }
    );
    console.log(deleteUser);
    if (!deleteUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({
      message: "User  deleted successfully.",
      user: deleteUser,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//controller to fetch userdetails by id
exports.fetchUserById = async (req, res) => {
  const id = req.params.id;
  User.findById({ _id: id })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
};
//controller to add user using csv file
// exports.csvCreateUser = async (req, res) => {
//   try {
//     console.log(req.body);

//     const headers = Object.keys(req.body[0]);

//     const csvWriter = createCsvWriter({
//       path: "output.csv",
//       header: headers,
//       append: true,
//     });

//     await csvWriter.writeRecords(req.body);

//     await User.insertMany(req.body);

//     res.status(200).json({ message: "CSV data processed successfully." });
//   } catch (error) {
//     console.error("Error processing CSV data:", error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

// exports.csvCreateUser = async (req, res) => {
//   try {
//     const users = req.body;
//     console.log("Received users data:", users);
//     if (!Array.isArray(users) || users.length === 0) {
//       return res.status(400).json({ message: "No user data provided" });
//     }
//     // Extract headers from the first object in the array
//     const headers = Object.keys(users[0]).map((key) => ({
//       id: key,
//       title: key,
//     }));

//     const csvWriter = createCsvWriter({
//       path: "users_output.csv",
//       header: headers,
//       append: true,
//     });

//     // Write CSV data
//     await csvWriter.writeRecords(users);

//     const insertUser = [];
//     const insertUserDetails = [];

//     for (let i = 0; i < users.length; i++) {
//       const { firstname, lastname, email, role } = users[i];
//       const password = "defaultPassword123"; // Set a default password

//       if (!(email && role)) {
//         return res
//           .status(400)
//           .json({ message: "All input fields are required" });
//       }

//       const oldUser = await User.findOne({ email });
//       if (oldUser) {
//         return res
//           .status(400)
//           .json({ message: `User with email ${email} already exists` });
//       }

//       let userRecord;
//       try {
//         userRecord = await firebase.auth().createUser({
//           email,
//           password,
//         });
//       } catch (error) {
//         console.error(`Error creating user ${email} in Firebase:`, error);
//         return res
//           .status(500)
//           .json({ message: `Error creating user ${email} in Firebase` });
//       }

//       const passwordResetLink = await firebase
//         .auth()
//         .generatePasswordResetLink(email);
//       // Send email with password reset link
//       await transporter.sendEmail({
//         from: "intern.lpt@gmail.com",
//         to: email,
//         subject: "Password Reset",
//         html: `
//     <p>You are receiving this email because a request was made to reset the password for your account.</p>
//     <p>Please follow these steps to reset your password:</p>
//     <p><a href="${passwordResetLink}" style="background-color: green; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
//   `,
//       });
//       const newUser = new User({
//         firstname,
//         lastname,
//         email: userRecord.email,
//         role,
//         user_id: userRecord.uid,
//       });

//       let savedUser;
//       try {
//         savedUser = await newUser.save();
//       } catch (error) {
//         console.error(`Error saving user ${email} to database:`, error);
//         return res
//           .status(500)
//           .json({ message: `Error saving user ${email} to database` });
//       }
//       insertUser.push(savedUser);

//       const newUserDetails = new UserDetails({
//         email,
//         userid: savedUser._id,
//       });

//       try {
//         const savedUserDetails = await newUserDetails.save();
//         insertUserDetails.push(savedUserDetails);
//       } catch (error) {
//         console.error(`Error saving user details for ${email}:`, error);
//         return res
//           .status(500)
//           .json({ message: `Error saving user details for ${email}` });
//       }
//     }

//     res.status(201).json({
//       message: "Users added successfully",
//       success: true,
//       users: insertUser,
//       userDetails: insertUserDetails,
//     });
//   } catch (error) {
//     console.error("Error processing CSV data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
exports.csvCreateUser = async (req, res) => {
  try {
    const users = req.body.data;
    console.log("Received users data:", users);

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "No user data provided" });
    }

    const insertUser = [];
    const insertUserDetails = [];

    for (let i = 0; i < users.length; i++) {
      const { firstname, lastname, email, role } = users[i];
      const password = "defaultPassword123";

      if (!(firstname && lastname && email && role)) {
        console.error(`Invalid user data at index ${i}:`, users[i]);
        return res.status(400).json({
          message: `Invalid data at index ${i}: All fields are required`,
        });
      }

      const oldUser = await User.findOne({ email });
      if (oldUser) {
        console.error(`User with email ${email} already exists`);
        return res
          .status(400)
          .json({ message: `User with email ${email} already exists` });
      }

      const userRecord = await firebase.auth().createUser({ email, password });
      const passwordResetLink = await firebase
        .auth()
        .generatePasswordResetLink(email);

      await transporter.sendEmail({
        from: "intern.lpt@gmail.com",
        to: email,
        subject: "Password Reset",
        html: `
          <p>You are receiving this email because a request was made to reset the password for your account.</p>
          <p>Please follow these steps to reset your password:</p>
          <p><a href="${passwordResetLink}" style="background-color: green; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        `,
      });

      const newUser = new User({
        firstname,
        lastname,
        email: userRecord.email,
        role,
        user_id: userRecord.uid,
      });
      const savedUser = await newUser.save();
      insertUser.push(savedUser);

      const newUserDetails = new UserDetails({ email, userid: savedUser._id });
      const savedUserDetails = await newUserDetails.save();
      insertUserDetails.push(savedUserDetails);
    }

    res.status(201).json({
      message: "Users added successfully",
      success: true,
      users: insertUser,
      userDetails: insertUserDetails,
    });
  } catch (error) {
    console.error("Error processing CSV data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
