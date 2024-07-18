const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const certificateSettingSchema = new mongoose.Schema({
  eventId: { type: Schema.Types.ObjectId, ref: "events", unique: true },
  certificateId: { type: Schema.Types.ObjectId, ref: "Certificates" },
  serialNumberType: {
    type: {
      type: String,
      enum: ["Random", "Incremental"], // Define the allowed types
      required: true,
    },
    prefix: {
      type: String,
      required: function () {
        return this.serialNumberType === "Incremental";
      }, // Required if serialNumberType is Incremental
    },
    nextNumber: {
      type: Number,
      required: function () {
        return this.serialNumberType === "Incremental";
      }, // Required if serialNumberType is Incremental
    },
    randomValue: String, // New field for storing random value
  },
  issueType: {
    type: String,
    required: true,
  },
  certificateType: {
    type: {
      type: String,
      enum: ["Completion", "KnowledgeBased"], // Define the allowed types
      required: true,
    },
    completionPercentage: {
      type: String,
      required: function () {
        return this.certificateType === "Completion";
      }, // Required if serialNumberType is Incremental
    },
    minimumPassingPercentage: {
      type: Number,
      required: function () {
        return this.certificateType === "Completion";
      }, // Required if serialNumberType is Incremental
    },

    quizeType: {
      type: String,
      required: function () {
        return this.certificateType === "KnowledgeBased";
      }, // Required if serialNumberType is Incremental
    },
    passingPercentage: {
      type: Number,
      required: function () {
        return this.certificateType === "KnowledgeBased";
      }, // Required if serialNumberType is Incremental
    },
  },

  certificateTemplate: {
    type: String,
    // required: true,
  },
  isDeleted: { type: Boolean, default: false },
  langCode:{type: String, required: true , default : "en"},
},{ timestamps: true });

const TemplateSchema = new mongoose.Schema({
  orientationType: {
    type: String,
    // required: true,
  },
  certificateName: {
    type: String,
    required: true,
  },
  certificateBody: {
    type: String,
    require: true,
  },
  langCode : {
    type: String,
    // required: true,
    default : 'en'
  },
  certificateImage:{  type: String, required: true } ,
  isDeleted: { type: Boolean, default: false },
  langCode:{type: String, required: true , default : "en"},
}, { timestamps: true });

const issueCertificateSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    // required: true,
  },
  username: {
    type: String,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  langCode:{type: String, required: true , default : "en"},
  // status: {
  //   type: String,
  //   required: true
  // }
}, { timestamps: true });

const TemplateCertificateSchema = new mongoose.Schema({
  certificateName: {
    type: String,
  },
  certificateBody: {
    type: String,
    require: true,
  },
  user_id: {
    type: String,
  },
  isDeleted: { type: Boolean, default: false },
  langCode:{type: String, required: true , default : "en"},
}, { timestamps: true });

module.exports = {
  CertificateSetting: mongoose.model(
    "CertificateSetting",
    certificateSettingSchema
  ),
  IssueCertificate: mongoose.model("IssueCertificate", issueCertificateSchema),
  Templates: mongoose.model("Template", TemplateSchema),
  IssueCertificate: mongoose.model("IssueCertificate", issueCertificateSchema),
  Certificates: mongoose.model("Certificates", TemplateCertificateSchema),
};
