const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  serialNumber: { type: Number }, // New field for sequential number
  Name: { type: String, default: null },
  OrgName : { type: String},
  SDate: { type: String},
  EDate: { type: String},
  STime: { type: String },
  ETime: {type: String},
  Duration : {type : String},
  Role : {type : String},
  Criteria : {type : String},
  InstCode : {type : String},
  InstName : {type : String},
  CourseDesp : {type : String},
  CourseType : {type : String},
  Delivery :{type : String},
  MeetLink : {type : String},
  EvaluLink: {type : String},
  MaterialLink: {type : String},
  Exam : {type : String},
  EventId:{type : String}, 
  OrgId:{type : String}, 
  EventDesp:{type : String}, 
  SchoolId:{type : String}, 
  SponsorName:{type : String}, 
  SponsorId:{type : String}, 
  CourseId:{type : String},
  CourseName:{type : String}, 
  AltCourseId:{type : String}, 
  AltCourseName:{type : String}, 
  CourseAffilation:{type : String},
  EventAccess:{type : String}, 
  OutlookCal:{type : String}, 
  Tags:{type : String},  
  CancelPolicy:{type : String}, 
  OptOut:{type : String}, 
  Certificate:{type : String},
  tagsInput:{type : String}, 
  dynamicFields: {type: Array},
  createdBy: {type : String, default : "purvadhopade@gmail.com"},  
  updatedBy: {type : String}, 
  isDeleted: { type: Boolean, default: false }
},
{ timestamps: true }
);

// Pre-save hook to assign sequential number
EventSchema.pre('save', async function(next) {
  try {
    if (!this.isNew) {
      return next(); // If the document is being updated, skip assigning a sequential number
    }
    
    // Find the total count of documents in the collection and increment it by 1
    const totalCount = await this.constructor.countDocuments();
    this.serialNumber = totalCount + 1;

    next();
  } catch (error) {
    next(error);
  }
});




const EventModel = mongoose.model("events", EventSchema) 
module.exports = EventModel
