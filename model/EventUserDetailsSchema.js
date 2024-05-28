const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String},
  email: {type: String},
  role: {type: String},
  password: { type: String},
  langCode:{type: String, required: true , default : "en"}
  
})

const UserModel = mongoose.model("EventUserDetails", UserSchema) 
module.exports = UserModel
