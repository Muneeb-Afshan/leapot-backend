// const Event = require('../../model/EventsSchema');
// const Module = require('../../model/ModuleSchema');
// const Lesson = require('../../model/LessonSchema');

// const Course = require('../../model/courseBuilder/CourseSchema');
const {
  Topic,
  Chapter,
  Module,
  CourseDetails,
  Course,
} = require("../../model/courseBuilder/CourseSchema");

exports.createCourse = async (req, res) => {
  try {
    console.log(req.body)
    const course = new Course(req.body);
    await course.save();
    res
      .status(201)
      .json({
        success: true,
        data: course,
        message: "Course added Sucessfully",
        statusCode: 200,
      });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.fetchCourses = async (req, res) => {
  try {
    const course = await Course.find({});

    res
      .status(201)
      .json({
        success: true,
        data: course,
        message: "Course Fetch Sucessfully",
        statusCode: 200,
      });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Controller method to logically delete a template
exports.logicalDeleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find the template by ID and update it
    const updatedCourseforDelete = await Course.findOneAndUpdate(
      { _id: courseId },
      { $set: { isDeleted: true } },
      { new: true } // Return the updated document
    );

    // If the template doesn't exist, return 404 Not Found
    if (!updatedCourseforDelete) {
      return res.status(404).json({ error: "course is not found" });
    }

    // Respond with success message
    return res
      .status(200)
      .json({ message: "course deleted", course: updatedCourseforDelete });
  } catch (error) {
    // Handle any errors
    console.error("Error in logicalDeleteCourse:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to add a new course as well as update a new course 
// exports.addCourseDetails = async (req, res) => {
//   try {
//     const { courseId, modules } = req.body;
//     console.log(courseId)


//     // Check if the course_id already exists

//     // Check if the course exists in the database
//     let course = await CourseDetails.findOne({ courseId });

//     // If the course exists, update it; otherwise, create a new course
//     if (course) {
//       // Update the existing course with the new data
//       course.modules = modules;
//     } else {
//       // Create a new course instance
//       course = new CourseDetails({ courseId, modules });
//     }
//     // Save the course to the database
//     const savedCourse = await course.save();
//     res.status(201).json({
//       success: true,
//       data: savedCourse,
//       message: "Course saved Sucessfully",
//       statusCode: 200,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// };


exports.addCourseDetails = async (req, res) => {
  try {
    const { courseId, courseStructure, modules, lessons, langCode } = req.user;
    // Validate and prepare data based on courseStructure
    let courseDetailsData;
    if (courseStructure === 'CMLT') {
      // Validate and prepare data for CMLT structure
      courseDetailsData = {
        courseId: courseId,
        courseStructure: courseStructure,
        modules: modules,
        lessons: [],
        langCode: langCode
      };
    } else if (courseStructure === 'CLT') {
      // Validate and prepare data for CLT structure
      courseDetailsData = {
        courseId: courseId,
        courseStructure: courseStructure,
        modules: [],
        lessons: lessons,
        langCode: langCode
      };
    } else {
      return res.status(400).json({ message: "Invalid course structure type" });
    }

    // Check if the course exists in the database
    let courseDetails = await CourseDetails.findOne({ courseId });

    if (courseDetails) {
      // If the course exists, update it with the new data
      courseDetails.modules = courseDetailsData.modules;
      courseDetails.lessons = courseDetailsData.lessons;
      courseDetails.courseStructure = courseStructure;
    } else {
      // Create a new course details instance
      courseDetails = new CourseDetails(courseDetailsData);
    }

    // Save the course details to the database
    const savedCourseDetails = await courseDetails.save();
    res.status(201).json({
      success: true,
      data: savedCourseDetails,
      message: "Course details saved successfully",
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get all courses
exports.fetchCoursesWithDetails = async (req, res) => {
  console.log(req.query, "fetchCoursesWithDetails id");
  try {
    // Extract id from query parameters
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
        statusCode: 400,
      });
    }

    // Retrieve course details from the database
    const courses = await CourseDetails.findOne({ courseId: id });
    res.status(200).json({
      success: true,
      data: courses,
      message: "Course fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Controller function to get all courses
exports.fetchAllCoursesWithDetails = async (req, res) => {
  try {
    // Retrieve all courses from the database
    const courses = await CourseDetails.find();
    res.status(200).json({
      success: true,
      data: courses,
      message: "Course fetch Sucessfully",
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


