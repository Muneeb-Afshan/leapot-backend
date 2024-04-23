const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String },
  Code: { type: String},
  user_id:{type:String},

  
})

const InstructorModel = mongoose.model("instructorLookup", InstructorSchema) 
module.exports = InstructorModel
