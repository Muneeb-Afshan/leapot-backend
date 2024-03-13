const InstructorModel = require ('../../model/Instructor')
// const UserModel = require ('../../model/EventUserDetailsSchema')

//adding the users in user detail table
//  exports.createUser = async (req, res) => {
//     console.log(req.body);
//     UserModel.create(req.body)
//         .then(user => res.json(user))
//         .catch(err => res.json(err));
// }

const User = require("../../model/EMuserSchema");
const UserDetails = require('../../model/EMuserDetailSchema')
//All Authentications rest API are list here

// To add user, admin will add the user
exports.createUser = async (req, res) => {
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

// //fetching the users details
exports.fetchUser = async(req, res) => { 
    User.find({})
    .then(user => res.json (user)) 
    .catch(err => res.json(err))
}

exports.logicalUserDelete = async(req, res) =>{
    const id = req.params.id;
    User.findByIdAndDelete({_id: id})
    .then(res => res.json (res)) 
    .catch(err => res.json(err))
}
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