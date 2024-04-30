const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  contactno: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  collegename: {
    type: String,
    required: true
  },
  yearofpassing: {
    type: Number,
    required: true
  },
  percent: {
    type: Number,
    required: true
  },
  currentpercent: {
    type: Number,
    required: true
  },
  withoutpay: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  Employmenttype: {
    type: String,
    enum: ['full-time', 'part-time'], 
    required: true
  },
  // uploadresume: {
  //   data: Buffer, // Binary data
  //   contentType: String // MIME type of the file
  // },
  status: {
    type: String,
    enum: ['new', 'in progress', 'resolved'],
    default: 'new'
  }
},
{
    timestamps: true
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
