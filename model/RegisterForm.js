const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
  username: { type: String},
  email: {type: String},
  password: { type: String}
  
})

const RegisterModel = mongoose.model("register", RegisterSchema) 
module.exports = RegisterModel
