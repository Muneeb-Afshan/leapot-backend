// models/ContactForm.js

const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {type : Number},
  message: {
    type: String,
    required: true
  },
//   attachments: [String],
  status: {
    type: String,
    enum: ['new', 'in progress', 'resolved'],
    default: 'new'
  },
  langCode:{type: String, required: true , default : "en"},
},
{
    timestamps: true
}
);

module.exports = mongoose.model('ContactForm', contactFormSchema);
