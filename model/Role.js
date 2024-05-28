// models/Role.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true

  } ,
  langCode : {
    type: String,
    // required: true,
    default : 'en'


  },
  langCode:{type: String, required: true , default : "en"}

});

module.exports = mongoose.model('Role', roleSchema);
