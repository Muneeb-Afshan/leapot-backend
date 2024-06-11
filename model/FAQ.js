// models/FAQ.js

const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  langCode:{type: String, required: true , default : "en"},
});

module.exports = mongoose.model('FAQ', faqSchema);
