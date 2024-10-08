const EventModel = require("../../model/Events");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

// POST
exports.createEvent = async (req, res) => {
  try {
    // Create a new instance of EventModel
    const newEvent = new EventModel({
      ...req.body,
      dynamicFields: req.body.dynamicFields, // Ensure this part is correctly passed
    });

    // Save the new event
    const event = await newEvent.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//FETCH
exports.fetchEvent = (req, res) => {
  console.log("Fetching events...");

  EventModel.find({ isDeleted: false })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .then((events) => {
      if (!events || events.length === 0) {
        console.log("No events found.");
        return res.status(404).json({ message: "No events found" });
      }

      console.log("Events fetched successfully:", events);
      res.json(events);
    })
    .catch((err) => {
      console.error("Error fetching events:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.fetchEventName = (req, res) => {
  EventModel.find({ isDeleted: false }, "EventName _id ")

    .then((event) => res.json(event))
    .catch((err) => res.json(err));
};

//UPDATE
exports.fetchEventById = async (req, res) => {
  const id = req.params.id;
  EventModel.findById({ _id: id })
    .then((event) => res.json(event))
    .catch((err) => res.json(err));
};

exports.updateEvent = async (req, res) => {
  const id = req.params.id;
  // EventModel.findByIdAndUpdate(id, req.body, { new: true })
  EventModel.findByIdAndUpdate(
    { _id: id },
    {
      EventName: req.body.EventName,
      OrgName: req.body.OrgName,
      SDate: req.body.SDate,
      EDate: req.body.EDate,
      STime: req.body.STime,
      ETime: req.body.ETime,
      ExpiryDate: req.body.ExpiryDate,
      Duration: req.body.Duration,
      Role: req.body.Role,
      Criteria: req.body.Criteria,
      InstCode: req.body.InstCode,
      InstName: req.body.InstName,
      CourseDesp: req.body.CourseDesp,
      CourseType: req.body.CourseType,
      Delivery: req.body.Delivery,
      MeetLink: req.body.MeetLink,
      EvaluLink: req.body.EvaluLink,
      MaterialLink: req.body.MaterialLink,
      Exam: req.body.Exam,
      EventId: req.body.EventId,
      OrgId: req.body.OrgId,
      CourseAvailable: req.body.CourseAvailable,
      EventDesp: req.body.EventDesp,
      SchoolId: req.body.SchoolId,
      SponsorName: req.body.SponsorName,
      SponsorId: req.body.SponsorId,
      CourseId: req.body.CourseId,
      CourseName: req.body.CourseName,
      AltCourseId: req.body.AltCourseId,
      AltCourseName: req.body.AltCourseName,
      CourseAffilation: req.body.CourseAffilation,
      EventAccess: req.body.EventAccess,
      OutlookCal: req.body.OutlookCal,
      CourseFees: req.body.CourseFees,
      Credits: req.body.Credits,
      SponsorLink: req.body.SponsorLink,
      ExamLink: req.body.ExamLink,
      State1ElectiveCore: req.body.State1ElectiveCore,
      State2ElectiveCore: req.body.State2ElectiveCore,
      ExpireAfter: req.body.ExpireAfter,
      CoursePrototype: req.body.CoursePrototype,
      EventSummary: req.body.EventSummary,
      ClassName: req.body.ClassName,
      ClassId: req.body.ClassId,
      AffiliationCategory: req.body.AffiliationCategory,
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      CancelPolicy: req.body.CancelPolicy,
      OptOut: req.body.OptOut,
      Certificate: req.body.Certificate,
      tagsInput: req.body.tagsInput,
      dynamicFields: Array.isArray(req.body.dynamicFields)
        ? req.body.dynamicFields
        : [],
      updatedBy: req.body.updatedBy,
    },
    { new: true }
  )
    .then((event) => res.json(event))
    .catch((err) => res.json(err));
};

// PATCH route to logically delete an event
exports.logicalEventDelete = async (req, res) => {
  const id = req.params.id;
  EventModel.findByIdAndUpdate(id, { isDeleted: true })
    .then(() => res.json({ message: "Event logically deleted" }))
    .catch((err) => res.status(500).json(err));
};

//CSV POST
//  exports.csvCreateEvent = async (req, res) => {
//   console.log(req.body)
//   const headers = Object.keys(req.body[0]);
//   const csvWriter = createCsvWriter({
//       path: 'output.csv',
//       header: headers, // Assuming all objects have the same structure
//       append: true, // Add this option to append to the existing file
//     });

//     // Check if the file exists, if not, create a new file with headers
//     if (!fs.existsSync('output.csv')) {
//       csvWriter.writeRecords([{}])
//         .then(() => console.log('CSV file created successfully'));
//     }

//     csvWriter.writeRecords(req.body[0])
//       .then(() => console.log('Data appended to CSV file successfully'));

//   EventModel.create(req.body[0])
//   .then(event => res.json (event))
//   .catch(err => res.json(err))
// }

exports.csvCreateEvent = async (req, res) => {
  try {
    console.log(req.body);

    const headers = Object.keys(req.body[0]);

    const csvWriter = createCsvWriter({
      path: "output.csv",
      header: headers,
      append: true,
    });

    await csvWriter.writeRecords(req.body);

    await EventModel.insertMany(req.body);

    res.status(200).json({ message: "CSV data processed successfully." });
  } catch (error) {
    console.error("Error processing CSV data:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
