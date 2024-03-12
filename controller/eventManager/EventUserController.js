const InstructorModel = require ('../../model/Instructor')
const UserModel = require ('../../model/EventUserDetailsSchema')

//adding the users in user detail table
 exports.createUser = async (req, res) => {
    console.log(req.body);
    UserModel.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err));
}

// //fetching the users details

exports.fetchUser = async(req, res) => { 
    UserModel.find({})
    .then(user => res.json (user)) 
    .catch(err => res.json(err))
}

exports.logicalUserDelete = async(req, res) =>{
    const id = req.params.id;
    UserModel.findByIdAndDelete({_id: id})
    .then(res => res.json (res)) 
    .catch(err => res.json(err))
}
// //Updating the User
exports.fetchUserById = async(req, res) => {
    const id = req.params.id;
    UserModel.findById({_id:id})
    .then(user => res.json (user)) 
    .catch(err => res.json(err))
}

exports.updateUserById = async(req, res) => {
    const id = req.params.id;
    // EventModel.findByIdAndUpdate(id, req.body, { new: true })
    UserModel.findByIdAndUpdate({_id: id}, {
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