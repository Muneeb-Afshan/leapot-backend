const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    serialNumber: { type: Number }, // New field for sequential number
    EventName: { type: String, default: null },
    OrgName: { type: String },
    SDate: { type: String },
    EDate: { type: String },
    STime: { type: [String] }, 
    ETime: { type: [String] }, 
    ExpiryDate: { type: String },
    Duration: { type: String },
    AffiliationCategory: { type: String },
    Criteria: { type: String },
    InstCode: { type: String },
    InstName: { type: String },
    CourseDesp: { type: String },
    CourseType: { type: String },
    EventNature: { type: String },
    CoursePrototype: { type: String },
    Delivery: { type: String },
    MeetLink: { type: String },
    EvaluLink: { type: String },
    MaterialLink: { type: String },
    ExamLink: { type: String },
    Exam: { type: String },
    EventId: { type: String },
    OrgId: { type: String },
    EventDesp: { type: String },
    EventSummary: { type: String },
    SchoolId: { type: String },
    SponsorName: { type: String },
    SponsorId: { type: String },
    SponsorLink: { type: String },
    CourseId: { type: String },
    CourseName: { type: String },
    ClassId: { type: String },
    ClassName: { type: String },
    ExpireAfter: { type: String },
    AltCourseId: { type: String },
    AltCourseName: { type: String },
    CourseAffilation: { type: String },
    State1ElectiveCore: { type: String },
    State2ElectiveCore: { type: String },
    Credits: { type: String },
    EventAccess: { type: String },
    OutlookCal: { type: String },
    CancelPolicy: { type: String },
    OptOut: { type: String },
    Certificate: { type: String },
    tags: { type: Array },
    CourseFees: { type: String },
    CourseAvailable: { type: String },
    dynamicFields: { type: Array },
    createdBy: { type: String, default: "Shashank@gmail.com" },
    updatedBy: { type: String },
    isDeleted: { type: Boolean, default: false },
    langCode: { type: String, required: true, default: "en" },
    sessionType: { type: String, default: "regular" },
    image: { type: String },
    MultipleStartDate:{type: Array},
    SingleDateEvents:{type: Array},
    Dynamic:{type: Array},
  },
  { timestamps: true }
);

// Pre-save hook to assign sequential number
EventSchema.pre("save", async function (next) {
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

const EventModel = mongoose.model("events", EventSchema);
module.exports = EventModel;
