const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstname: { type : String},
  lastname: { type : String},
  Code: { type: String},
  user_id:{type:String},
  langCode:{type: String, required: true , default : "en"},

  
})

const InstructorModel = mongoose.model("instructorLookup", InstructorSchema) 
module.exports = InstructorModel
