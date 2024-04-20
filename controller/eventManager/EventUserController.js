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
const firebase = require("firebase-admin");
// To add user, admin will add the user
exports.createUser = async (req, res) => {
  const { firstname, lastname, email, role, password, username } = req.body;

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
    username: username,
    user_id: userRecord.uid,
  });
  console.log(NewUser);
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

//Add Users by CSV File
exports.createUsersByCSV = async (req, res) => {
  const users = req.body;
  console.log("User from Event Controller" + users);
  // const { email, role, password, username } = req.body;

  const insertUser = [];
  const insertUserDetials = [];

  for (let i = 0; i < users.length; i++) {
    const {firstname,lastname, email, role, password, username } = users[i];

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
      firstname:firstname,
      lastname:lastname,
      email: userRecord.email,
      role: role,
      username: username,
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
