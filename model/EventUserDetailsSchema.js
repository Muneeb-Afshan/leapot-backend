const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String},
  email: {type: String},
  role: {type: String},
  password: { type: String}
  
})

const UserModel = mongoose.model("EventUserDetails", UserSchema) 
module.exports = UserModel
