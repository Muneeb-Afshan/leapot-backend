const mongoose = require('mongoose');

const certificateSettingSchema = new mongoose.Schema({

  eventId: mongoose.Schema.Types.ObjectId,
  serialNumberType: {
    type: {
      type: String,
      enum: ['Random', 'Incremental'], // Define the allowed types
      required: true
    },
    prefix: {
      type: String,
      required: function() { return this.serialNumberType === 'Incremental'; } // Required if serialNumberType is Incremental
    },
    nextNumber: {
      type: Number,
      required: function() { return this.serialNumberType === 'Incremental'; } // Required if serialNumberType is Incremental
    },
    randomValue: String // New field for storing random value
  },
  issueType: {
    type: String,
    required: true,
  },
  certificateType: {
    type: String,
    required: true,
  },
  certificateTemplate: {
    type: String,
    required: true,
  },
});


const certificateTemplateSchema = new mongoose.Schema({

  orientationType: {
    type: String,
    required: true,
  },
  certificateBody: {
    type: String,
    required: true,
  },
});


const issueCertificateSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  username: {
    type: String
   
  },
  issueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

const eventCertificateSchema = new mongoose.Schema({
   certificateName :{
    type: String 
    
   } ,
   certificateBody : {
    type : String,
    require: true
   } ,
   user_id : {
    type: String
   }
});


module.exports = {
  CertificateSetting: mongoose.model('CertificateSetting', certificateSettingSchema),
  IssueCertificate: mongoose.model('IssueCertificate', issueCertificateSchema),
  CertificateTemplate: mongoose.model('CertificateTemplate', certificateTemplateSchema),
  IssueCertificate: mongoose.model('IssueCertificate', issueCertificateSchema),
  EventCertificate: mongoose.model('EventCertificate', eventCertificateSchema),

};
