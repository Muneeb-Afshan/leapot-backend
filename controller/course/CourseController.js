const Event = require('../../model/EventsSchema');
const Module = require('../../model/ModuleSchema');
const Lesson = require('../../model/LessonSchema');

const Course = require('../../model/courseBuilder/CourseSchema');

exports.createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({ success: true, data: course , message:"Course added Sucessfully" , statusCode:200 });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.fetchCourses = async (req, res) => {
  try {
      const course = await Course.find({})
    
      res.status(201).json({ success: true, data: course , message:"Course Fetch Sucessfully" , statusCode:200});
  } catch (err) {
      res.status(400).json({ success: false, error: err.message });
  }
};

// controllers/moduleController.js

exports.createModule = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const module = new Module({
      ...req.body,
      eventId,
    });
    await module.save();
    res.json(module);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating module' });
  }
};




// controllers/lessonController.js

exports.createLesson = async (req, res) => {
  try {
    const { eventId, moduleId } = req.params;
    const module = await Module.findOne({ _id: moduleId, eventId });
    if (!module) {
      return res.status(404).json({ message: 'Module not found for the event' });
    }
    const lesson = new Lesson({
      ...req.body,
      eventId,
      moduleId,
    });
    await lesson.save();
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating lesson' });
  }
};


// controllers/dataController.js

exports.getAllData = async (req, res) => {
  try {
    const events = await Event.find().populate({
      path: 'modules',
      populate: {
        path: 'lessons',
      },
    });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  }
};


// controllers/courseController.js


// exports.fetchCourses = async (req, res) => {
//   try {
//     // Fetch all events (courses)
//     const events = await Event.find();
//     // Fetch modules for each event
//     const populatedEvents = [];
//     for (const event of events) {
//       const modules = await Module.find({ eventId: event._id });
//       const populatedModules = [];
//       for (const module of modules) {
//         const lessons = await Lesson.find({ moduleId: module._id });
//         populatedModules.push({ ...module.toJSON(), lessons });
//       }
//       populatedEvents.push({ ...event.toJSON(), modules: populatedModules });
//     }

//     res.json(populatedEvents);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching courses' });
//   }
// };
