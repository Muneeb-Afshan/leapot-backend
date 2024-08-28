const InstructorModel = require("../../model/Instructor");
const User = require("../../model/UserSchema");
const UserDetails = require("../../model/UserDetailsSchema");
//All Authentications rest API are list here
const { sendEmail } = require("../emailUtility/SendEmailFunction");
const firebase = require("firebase-admin");
const nodemailer = require("nodemailer");
const transporter = require("../emailUtility/SendEmailFunction");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const BlacklistedUser = require("../../model/BlacklistedUser");
const SendersMail = "contact@leapot.in";
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
      subject: "Welcome to Leapot Technologies!",
      html: `
        <p>Hello ${firstname},</p>
        <p>Welcome to Leapot Technologies! We are excited to have you on board.</p>
        <p>Your account has been successfully created by our Admin. Here are your account details:</p>
        <p>Login email id: ${email}</p>
        <p>To get started, please click on the link below and set your password and start exploring features in.</p>
        <p><a href="${passwordResetLink}">${passwordResetLink}</a></p>
        <p>If you have any questions or need assistance, our support team is here to help you. Feel free to reach out to us at contact@leapot.in or +917038585222.</p>
        <p>Once again, welcome aboard! We look forward to working with you.</p>
        <p>Best regards,</p>
        <p>Leapot Team</p>
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
    // Fetch user details from the database
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const firstName = user.firstname;

    const passwordResetLink = await firebase
      .auth()
      .generatePasswordResetLink(email);
    console.log("passwordResetLink email :", passwordResetLink);

    // Send email with password reset link
    await transporter.sendEmail({
      from: "intern.lpt@gmail.com",
      to: email,
      subject: "Request for Password Reset",
      html: `
        <p>Hello ${firstName},</p>
        <p>We received a request to reset your password for your Leapot LMS account. If you did not make this request, please ignore this email.</p>
        <p>To reset your password, click the link below:</p>
       <p><a href="${passwordResetLink}">${passwordResetLink}</a></p>
        <p>This link will expire in 24 hours for security reasons. If you need a new link, you can request another password reset <a href="[Password Reset Page Link]">here</a>.</p>
        <p>If you have any questions or need further assistance, please contact our support team.</p>
        <p>Thank you,</p>
        <p>Leapot Support Team</p>
        <hr/>
        <p>Security Tip: For your protection, never share your password with anyone.</p>
        <hr/>
        <p>Leapot Technologies</p>
        <p>Phone: +917038585222</p>
        <p>Email: contact@leapot.in</p>
        <p>Follow us on : <a href="https://in.linkedin.com/company/leapot-technologies">LinkedIn</a></p>
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
  const {
    firstname,
    lastname,
    countryCode,
    userState,
    userStateLNo,
    userCountry,
    phoneNo,
    picture,
    role,
    referredBy,
  } = req.body;
  console.log("outside try in update", req.body);
  try {
    console.log("inside try in update", req.body);
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Update fields only if new data is provided
    if (firstname !== undefined) user.firstname = firstname;
    if (lastname !== undefined) user.lastname = lastname;
    if (countryCode !== undefined) user.countryCode = countryCode;
    if (userState !== undefined) user.userState = userState;
    if (userStateLNo !== undefined) user.userStateLNo = userStateLNo;
    if (userCountry !== undefined) user.userCountry = userCountry;
    if (phoneNo !== undefined) user.phoneNo = phoneNo;
    if (picture !== undefined) user.picture = picture;
    if (role !== undefined) user.role = role;

    if (referredBy !== undefined) user.learnerDetails.referredBy = referredBy;

    // Save the updated user
    const updatedUser = await user.save();

    return res.status(200).json({
      user: updatedUser,
      message: "User profile updated successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error updating user profile:", err.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
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
const UserAction = require("../../model/UserActionSchema");
const UserHistory = require("../../model/UserHistorySchema");
const moment = require("moment");
const fs = require("fs");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid"); // Import UUID generator
// const bucketName = process.env.AWS_BUCKETNAME;
const path = require("path");

// Configure AWS S3
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESSKEYID,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  signatureVersion: "v4",
});

async function uploadToS3(filePath, bucketName) {
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: bucketName,
    Key: `lms/userModule/${uuidv4()}-${path.basename(filePath)}`,
    Body: fileContent,
  };
  return s3.upload(params).promise();
}

exports.csvCreateUser = async (req, res) => {
  try {
    const { validRecords, invalidRecords } = req.body;

    console.log("Received validRecords:", validRecords);
    console.log("Received invalidRecords:", invalidRecords);

    if (
      (!Array.isArray(validRecords) || validRecords.length === 0) &&
      (!Array.isArray(invalidRecords) || invalidRecords.length === 0)
    ) {
      return res.status(400).json({ message: "No user data provided" });
    }

    const insertUser = [];
    const insertUserDetails = [];
    const successfulRecords = [];
    const failedRecords = [...invalidRecords]; // Initialize with invalid records

    const timestamp = moment().format("YYYYMMDD_HHmmss");

    const successCsvFilePath = `successfulUserRecords_${timestamp}.csv`;
    const failureCsvFilePath = `failureUserRecords_${timestamp}.csv`;

    const successCsvWriter = createCsvWriter({
      path: successCsvFilePath,
      header: [
        { id: "firstname", title: "First Name" },
        { id: "lastname", title: "Last Name" },
        { id: "email", title: "Email" },
        { id: "role", title: "Role" },
      ],
    });

    const failureCsvWriter = createCsvWriter({
      path: failureCsvFilePath,
      header: [
        { id: "firstname", title: "First Name" },
        { id: "lastname", title: "Last Name" },
        { id: "email", title: "Email" },
        { id: "role", title: "Role" },
        { id: "error", title: "Error" },
      ],
    });

    for (let i = 0; i < validRecords.length; i++) {
      const { firstname, lastname, email, role } = validRecords[i];
      const password = "defaultPassword123";

      const oldUser = await User.findOne({ email });
      if (oldUser) {
        const error = `User with email ${email} already exists`;
        console.error(error);
        failedRecords.push({ ...validRecords[i], error });
        await new UserAction({
          action: "failed records",
          remarks: error,
        }).save();
        continue;
      }

      try {
        const userRecord = await firebase
          .auth()
          .createUser({ email, password });
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

        const newUserDetails = new UserDetails({
          email,
          userid: savedUser._id,
        });
        const savedUserDetails = await newUserDetails.save();
        insertUserDetails.push(savedUserDetails);

        successfulRecords.push(validRecords[i]);
        await new UserAction({
          action: "successfully added",
          remarks: "added user in database",
        }).save();
      } catch (error) {
        console.error("Error processing user:", error);
        failedRecords.push({ ...validRecords[i], error: error.message });
        await new UserAction({
          action: "failed records",
          remarks: error.message,
        }).save();
      }
    }

    await successCsvWriter.writeRecords(successfulRecords);
    await failureCsvWriter.writeRecords(failedRecords);

    const successFileUrl = (
      await uploadToS3(successCsvFilePath, process.env.AWS_BUCKETNAME)
    ).Location;
    const failureFileUrl = (
      await uploadToS3(failureCsvFilePath, process.env.AWS_BUCKETNAME)
    ).Location;

    // Delete local files
    fs.unlink(successCsvFilePath, (err) => {
      if (err) {
        console.error(`Error deleting success CSV file: ${err}`);
      } else {
        console.log("Success CSV file deleted");
      }
    });

    fs.unlink(failureCsvFilePath, (err) => {
      if (err) {
        console.error(`Error deleting failure CSV file: ${err}`);
      } else {
        console.log("Failure CSV file deleted");
      }
    });

    const lastHistory = await UserHistory.findOne().sort({ SrNo: -1 });
    const SrNo = lastHistory ? lastHistory.SrNo + 1 : 1;
    const totalRecords = successfulRecords.length + failedRecords.length;

    const userHistory = new UserHistory({
      SrNo,
      SuccessfulRecords: successfulRecords.length,
      FailedRecords: failedRecords.length,
      TotalRecords: totalRecords,
      TimeofAction: new Date(),
      SuccessFilePath: successFileUrl,
      FailureFilePath: failureFileUrl,
    });
    await userHistory.save();

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
exports.blacklistUsers = async (req, res) => {
  try {
    const { email, reason, disqualifiedBy } = req.body;

    console.log("Request received to blacklist user with email:", email);
    console.log("Disqualified by:", disqualifiedBy);
    console.log("Reason for blacklisting:", reason);

    // Check if the user exists in the User collection
    const user = await User.findOne({ email });
    console.log("User found in the database:", user);

    await User.updateOne({ email }, { blacklisted: true });
    console.log("User successfully updated to blacklisted");

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the email already exists in the blacklist
    const existingBlacklistedUser = await BlacklistedUser.findOne({ email });
    console.log("Existing blacklisted user check:", existingBlacklistedUser);

    if (existingBlacklistedUser) {
      console.log("User already exists in the blacklist");
      return res.status(409).json({
        success: false,
        message: "User already exists in the blacklist",
      });
    }

    // Create a new blacklisted user record with disqualifiedBy
    const data = await BlacklistedUser.create({
      email,
      reason,
      disqualifiedBy,
      createdAt: new Date(),
    });
    console.log("Blacklisted user record created:", data);
    const mailOptions = {
      from: SendersMail,
      to: email,
      // to: "atharavuttekar@gmail.com",

      subject: "You have been blacklisted",
      text: `Dear user, you have been blacklisted for the following reason: ${reason}.`,
    };

    await transporter.sendEmail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "User blacklisted successfully",
      statusCode: 200,
      data: data,
    });
  } catch (error) {
    console.error("Error blacklisting users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to blacklist user",
    });
  }
};

exports.getBlacklistedUsers = async (req, res) => {
  try {
    // Fetch blacklisted users from the database
    const blacklistedUsers = await BlacklistedUser.find({ blacklisted: true });

    // Return the fetched blacklisted users as a response
    return res.status(200).json({
      success: true,
      message: "Blacklisted users fetched successfully",
      data: blacklistedUsers,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error fetching blacklisted users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blacklisted users",
    });
  }
};
exports.UpdateBlacklistedUsers = async (req, res) => {
  try {
    const { email } = req.params;
    const { reason, disqualifiedBy } = req.body;

    console.log("Request parameters:", req.params);
    console.log("Request body:", req.body);

    // Find the blacklisted user by email
    const existingBlacklistedUser = await BlacklistedUser.findOne({ email });

    if (!existingBlacklistedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found in blacklist",
      });
    }

    // Update the blacklisted user
    const updatedUser = await BlacklistedUser.findOneAndUpdate(
      { email },
      { reason, disqualifiedBy, updatedAt: new Date() },
      { new: true } // Return the updated document
    );

    // Send email notification
    const mailOptions = {
      from: SendersMail,
      to: "atharavuttekar@gmail.com", // Replace with actual user's email
      // to: email, // Replace with actual user's email
      subject: "Your blacklist status has been updated",
      text: `Dear user, your blacklist status has been updated with the following reason: ${reason}.`,
    };

    await sendEmail(mailOptions);

    console.log("Update operation completed and email sent");

    return res.status(200).json({
      success: true,
      message: "Blacklisted user updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating blacklisted user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blacklisted user",
    });
  }
};

exports.deleteblacklistUsers = async (req, res) => {
  try {
    const { email } = req.params;

    const result = await BlacklistedUser.findOneAndDelete({ email });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found in blacklist",
      });
    }

    await User.updateOne({ email }, { blacklisted: false });

    // Send email notification
    const mailOptions = {
      from: SendersMail,
      to: email,
      // to: "atharavuttekar@gmail.com",
      subject: "You have been removed from the blacklist",
      text: `Dear user, you have been removed from the blacklist and can access the services again.`,
    };

    await transporter.sendEmail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Blacklisted user removed successfully and notified via email",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting blacklisted user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blacklisted user",
    });
  }
};
