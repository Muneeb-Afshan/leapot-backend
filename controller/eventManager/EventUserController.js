const InstructorModel = require ('../../model/Instructor')
// const UserModel = require ('../../model/EventUserDetailsSchema')

//adding the users in user detail table
//  exports.createUser = async (req, res) => {
//     console.log(req.body);
//     UserModel.create(req.body)
//         .then(user => res.json(user))
//         .catch(err => res.json(err));
// }

const User = require("../../model/UserSchema");
const UserDetails = require('../../model/UserDetailsSchema')
//All Authentications rest API are list here
const firebase = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'intern.lpt@gmail.com',
    pass: 'uppm qskv gihw vecc'
  }
});

// function generateRandomPassword(length) {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let password = '';
//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     password += characters.charAt(randomIndex);
//   }
//   return password;
// }


exports.passwordResetLink = async (req, res) =>{
  const { email } = req.body;
  console.log("email", req.body)
  console.log("email", email)

  try{
    // const oldUser = await User.findOne({ email: req.body });
    // console.log(oldUser)
    // if (!oldUser) {
    //   return res.json({
    //     message: "User not exist in database",
    //     success: false,
    //   });
    // }
  
  const passwordResetLink = await firebase.auth().generatePasswordResetLink(email);
  console.log('passwordResetLink email :', passwordResetLink);

 // Send email with password reset link
 await transporter.sendMail({
  from: 'intern.lpt@gmail.com',
  to: email,
  subject: 'Password Reset',
  html: `
  <p>You are receiving this email because a request was made to reset the password for your account.</p>
  <p>Please follow these steps to reset your password:</p>
  <p><a href="${passwordResetLink}" style="background-color: green; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
`
}); 
res.json({ success: true });
  } catch(e){
    console.log(e.message)
    res.json({ success: false });
  }
}

// To add user, admin will add the user
exports.createUser = async (req, res) => {
  const { email, role , password , username } = req.body;
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
    password
  })
  await firebase.auth().generateEmailVerificationLink(email)
  .then((link) => {
    console.log('Verification email link:', link);
    // You can send this link to the user via email
  });

  const passwordResetLink = await firebase .auth().generatePasswordResetLink(email);
  console.log('passwordResetLink email link:', passwordResetLink);

//  Send email with password reset link
 await transporter.sendMail({
  from: 'contact@leapot.in',
  to: email,
  subject: 'Password Reset Link For Acoount',
  html: `
  <p>You are receiving this email because a request was made to reset the password for your account.</p>
  <p>Please follow these steps to reset your password:</p>
  <p><a href="${passwordResetLink}" style="background-color: green; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
`
});



  console.log("create" , userRecord.email)

  const NewUser = new User({
    email: userRecord.email,
    role: role,
    username:username,
    user_id:userRecord.uid
  });
  NewUser.save();

  const NewUserDetails = new UserDetails({
    email: email,
    userid:NewUser._id
  });
  NewUserDetails.save();

if(role === 'Instructor'){
  
  const addInstructor = new InstructorModel({
    email: email,
    userid:NewUser._id,
    username:username,

  });
  addInstructor.save();

}

  return res.status(201).json({
    data: NewUser,
    message: "Learner Add successfull",
    success: true,
    statsCode:201
  });
};

// //fetching the users details
exports.fetchUser = async(req, res) => { 
    User.find({ deleteStatus: false })
    .then(user => res.json (user)) 
    .catch(err => res.json(err))
}

exports.logicalUserDelete = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Delete user from User table
      const res =  await User.findByIdAndUpdate(id , {deleteStatus :true});
 console.log(res)
        // Delete user details from UserDetail table
        // await UserDetails.findOneAndDelete({ userid: id });
        
        res.status(200).json({ message: 'User  deleted successfully.',res : res});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// //Updating the User
exports.fetchUserById = async(req, res) => {
    const id = req.params.id;
    User.findById({_id:id})
    .then(user => res.json (user)) 
    .catch(err => res.json(err))
}

exports.updateUserById = async(req, res) => {
    const id = req.params.id;
    // EventModel.findByIdAndUpdate(id, req.body, { new: true })
    User.findByIdAndUpdate({_id: id}, {
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password
      }, { new: true })
    .then(event => res.json (event)) 
    .catch(err => res.json(err))
}


exports.logicalAllUserDelete =async (req, res) =>{
  const { rows } = req.body;
  console.log(rows)

    // Perform the deletion operation in your database
    // This is just a placeholder, replace it with your actual database deletion logic
    await UserDetails.deleteMany({ userid: { $in: rows} });
    User.deleteMany({ _id: { $in: rows} })
        .then(() => {
         
            // Return a success response if deletion is successful
            res.status(200).json({ message: 'Rows deleted successfully' });
        })
        .catch(err => {
            // Return an error response if an error occurs during deletion
            console.error('Error deleting rows:', err);
            res.status(500).json({ error: 'An error occurred while deleting rows' });
        });
}

//Add Instructor

//POST
exports.addInstructure =async (req, res) => {
    console.log(req.body) 
    InstructorModel.create(req.body) 
    .then(event => res.json (event)) 
    .catch(err => res.json(err))
}

//GET
exports.getInstructor = async(req, res) => {
    // const id = req.params.id;
    InstructorModel.find()
    .then(event => res.json (event)) 
    .catch(err => res.json(err))
}