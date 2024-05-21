const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
  username: { type: String},
  email: {type: String},
  password: { type: String},
  langCode:{type: String, required: true , default : "en"},
  
})

const RegisterModel = mongoose.model("register", RegisterSchema) 
module.exports = RegisterModel
