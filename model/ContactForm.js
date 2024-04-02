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
  subject: {type : String},
  message: {
    type: String,
    required: true
  },
//   attachments: [String],
  status: {
    type: String,
    enum: ['new', 'in progress', 'resolved'],
    default: 'new'
  }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('ContactForm', contactFormSchema);
