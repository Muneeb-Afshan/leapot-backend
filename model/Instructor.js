const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema({
  Name: { type: String, default: null },
  Code: { type: String}
  
})

const InstructorModel = mongoose.model("instructor", InstructorSchema) 
module.exports = InstructorModel
