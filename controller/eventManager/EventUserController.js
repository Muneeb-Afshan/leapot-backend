const InstructorModel = require("../../model/Instructor");
// const UserModel = require ('../../model/EventUserDetailsSchema')

//adding the users in user detail table
//  exports.createUser = async (req, res) => {
//     console.log(req.body);
//     UserModel.create(req.body)
//         .then(user => res.json(user))
//         .catch(err => res.json(err));
// }

const User = require("../../model/UserSchema");
const UserDetails = require("../../model/UserDetailsSchema");
//All Authentications rest API are list here
const { sendEmail } = require("../emailUtility/SendEmailFunction");
const firebase = require("firebase-admin");
const nodemailer = require("nodemailer");
const transporter = require("../emailUtility/SendEmailFunction");

// Initialize Nodemailer transporter
// Create transporter

// function generateRandomPassword(length) {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let password = '';
//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     password += characters.charAt(randomIndex);
//   }
//   return password;
// }

exports.emailTest = async (req, res) => {
  const { email } = req.body;
  console.log("email", req.body);
  console.log("email", email);
  const name = "Ganesh";

  try {
    const emailOptions = {
      from: '"Leapot Technologies" <contact@leapot.in>',
      to: email,
      subject: "Custom Subject",
      html: `<p><span style="font-size:11pt;">Dear ${name},</span></p>
      <p><br></p>
      <p><span style="font-size:11pt;">Greetings of the day! We wanted to take a moment to express our gratitude for your recent application for the&nbsp;</span><span style="background-color:#ffff00;font-size:11pt;">[Position Title]</span><span style="font-size:11pt;">&nbsp;role here at Leapot Technologies. We appreciate the time and effort you&apos;ve invested in applying for the position.</span></p>
      <p><br></p>
      <p><span style="font-size:11pt;">Your application is important to us, and we are currently reviewing it carefully to assess how your skills, experience, and qualifications align with the requirements of the role. We understand that waiting can be challenging, but please rest assured that we are diligently working through the applications.</span></p>
      <p><br></p>
      <p><span style="font-size:11pt;">Should your qualifications match what we&apos;re looking for, we will reach out to you to schedule an interview or to request further information. In the meantime, feel free to explore more about our company and the work we do on our website or social media channels.</span></p>
      <p><br></p>
      <p><span style="font-size:11pt;">Once again, thank you for considering a career opportunity with us. We appreciate your interest in joining our team.</span></p>
      <p><br></p>
      <p><span style="font-size:11pt;">Best regards,</span></p>
      <p><br></p>
      <p><span style="font-size:11pt;">HR</span></p>
      <p><span style="font-size:11pt;">Leapot Technologies</span></p>
      <p><a href="mailto:hr@leapot.in"><u><span style="color:#1155cc;font-size:11pt;">hr@leapot.in</span></u></a></p>`,
    };

    // Call the sendEmail function with the email options
    sendEmail(emailOptions);

    res.json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.json({ success: false });
  }
};

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
    await transporter.sendMail({
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

// To add user, admin will add the user
exports.createUser = async (req, res) => {
  const { firstname, lastname, email, role, password } = req.body;

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

  // const password = generateRandomPassword(6)
  const userRecord = await firebase.auth().createUser({
    email,
    password,
  });
  await firebase
    .auth()
    .generateEmailVerificationLink(email)
    .then((link) => {
      console.log("Verification email link:", link);
      // You can send this link to the user via email
    });

  const passwordResetLink = await firebase
    .auth()
    .generatePasswordResetLink(email);
  console.log("passwordResetLink email link:", passwordResetLink);

  //  Send email with password reset link
  await transporter.sendMail({
    from: "contact@leapot.in",
    to: email,
    subject: "Password Reset Link For Acoount",
    html: `
  <p>You are receiving this email because a request was made to reset the password for your account.</p>

  <p><a href="${passwordResetLink}" style="background-color: green; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
`,
  });

  const NewUser = new User({
    firstname: firstname,
    lastname: lastname,
    email: userRecord.email,
    role: role,

    user_id: userRecord.uid,
  });
  console.log(NewUser);
  NewUser.save();

  const NewUserDetails = new UserDetails({
    email: email,
    userid: NewUser._id,
  });
  NewUserDetails.save();

  if (role === "Instructor") {
    const addInstructor = new InstructorModel({
      email: email,
      userid: NewUser._id,
      firstname: firstname,
      lastname: lastname,
    });
    addInstructor.save();
  }

  return res.status(201).json({
    data: NewUser,
    message: "Learner Add successfull",
    success: true,
    statsCode: 201,
  });
};

//Add Users by CSV File
exports.createUsersByCSV = async (req, res) => {
  const users = req.body;
  console.log("User from Event Controller" + users);
  // const { email, role, password, username } = req.body;

  const insertUser = [];
  const insertUserDetials = [];

  for (let i = 0; i < users.length; i++) {
    const { firstname, lastname, email, role, password } = users[i];

    console.log(users[i]);
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

    const userRecord = await firebase.auth().createUser({
      email,
      password,
    });
    console.log("create", userRecord.email);

    const NewUser = new User({
      firstname: firstname,
      lastname: lastname,
      email: userRecord.email,
      role: role,

      user_id: userRecord.uid,
    });
    const saveUser = await NewUser.save();
    insertUser.push(saveUser);

    const NewUserDetails = new UserDetails({
      email: email,
      userid: NewUser._id,
    });
    const saveUserDetails = await NewUserDetails.save();
    insertUserDetials.push(saveUserDetails);
  }
  return res.status(201).json({
    message: "Learner Add successfull",
    success: true,
    statsCode: 201,
    insertUser,
    insertUserDetials,
  });
};

// //fetching the users details
exports.fetchUser = async (req, res) => {
  User.find({ deleteStatus: false })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
};

exports.logicalUserDelete = async (req, res) => {
  try {
    const id = req.params.id;

    // Delete user from User table
    const res = await User.findByIdAndUpdate(id, { deleteStatus: true });
    console.log(res);
    // Delete user details from UserDetail table
    // await UserDetails.findOneAndDelete({ userid: id });

    res.status(200).json({ message: "User  deleted successfully.", res: res });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// //Updating the User
exports.fetchUserById = async (req, res) => {
  const id = req.params.id;
  User.findById({ _id: id })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
};

exports.updateUserById = async (req, res) => {
  const id = req.params.id;
  // EventModel.findByIdAndUpdate(id, req.body, { new: true })
  User.findByIdAndUpdate(
    { _id: id },
    {
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
    },
    { new: true }
  )
    .then((event) => res.json(event))
    .catch((err) => res.json(err));
};

exports.logicalAllUserDelete = async (req, res) => {
  const { rows } = req.body;
  console.log(rows);

  // Perform the deletion operation in your database
  // This is just a placeholder, replace it with your actual database deletion logic
  await UserDetails.deleteMany({ userid: { $in: rows } });
  User.deleteMany({ _id: { $in: rows } })
    .then(() => {
      // Return a success response if deletion is successful
      res.status(200).json({ message: "Rows deleted successfully" });
    })
    .catch((err) => {
      // Return an error response if an error occurs during deletion
      console.error("Error deleting rows:", err);
      res.status(500).json({ error: "An error occurred while deleting rows" });
    });
};

//Add Instructor

//POST
exports.addInstructure = async (req, res) => {
  console.log(req.body);
  InstructorModel.create(req.body)
    .then((event) => res.json(event))
    .catch((err) => res.json(err));
};

//GET
exports.getInstructor = async (req, res) => {
  // const id = req.params.id;
  InstructorModel.find()
    .then((event) => res.json(event))
    .catch((err) => res.json(err));
};
