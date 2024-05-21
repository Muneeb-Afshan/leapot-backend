// models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  delete_flag: {
    type: Boolean,
    default: false
  },
  langCode:{type: String, required: true , default : "en"}
});

module.exports = mongoose.model('Blog', blogSchema);
