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

// exports.createCourse = async (req, res) => {
//   try {
//     console.log(req.body)
    
//     const course = new Course(req.body);
//     await course.save();
//     res
//       .status(201)
//       .json({
//         success: true,
//         data: course,
//         message: "Course added Sucessfully",
//         statusCode: 200,
//       });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }
// };
const nodeHtmlToImage = require("node-html-to-image");

const CoursePageBuilder = require('../../model/courseBuilder/CoursePageBuilderSchema')

// exports.createCourse = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { _id, ...courseData } = req.body;
          
//     // Upsert: update the course if it exists, otherwise create a new one
//     const course = await Course.findOneAndUpdate(
//       { _id }, // Filter
//       { $set: courseData }, // Update fields
//       { new: true, upsert: true, setDefaultsOnInsert: true } // Options: return the updated document, create if not exists
//     );

//     console.log(course , "course")

//     res.status(201).json({
//       success: true,
//       data: course,
//       message: "Course added/updated successfully",
//       statusCode: 200,
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }
// };


exports.upsertCourse = async (req, res) => {
  try {
    console.log(req.body);
    const { _id, ...courseData } = req.body;

    let course;

    if (_id) {
      // If _id is present, update the existing course
      console.log(_id , "under id")
      course = await Course.findOneAndUpdate(
        { _id }, // Filter
        { $set: courseData }, // Update fields
        { new: true, upsert: true, setDefaultsOnInsert: true } // Options: return the updated document, create if not exists
      );
    } else {
      // If _id is not present, create a new course
      course = new Course(courseData);
      console.log(_id , "outer id id")

      await course.save();
    }

    console.log(course ,"course")

    res.status(200).json({ success: true, course });
  } catch (err) {
    console.log('Error occurs while upserting course', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.createCourseById = async (req, res) => {
  try {
    console.log(req.body);
    const originalCourse = await Course.findById({_id :req.body.id});

    if (!originalCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Create a new course object without the _id
    const newCourseData = originalCourse.toObject();
   
    delete newCourseData._id;
    delete newCourseData.createdAt;
    delete newCourseData.updatedAt;

    // Modify the title
    newCourseData.generalInformation.title = "Copied " + newCourseData.generalInformation.title;

    const newCourse = new Course(newCourseData);
    await newCourse.save();
    console.log(newCourse , "newCourse");

    res.status(201).json({
      success: true,
      data: newCourse,
      message: "Course copied successfully",
      statusCode: 201,
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
        message: "Course Fetch Sucessfully ",
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
    const { courseId, courseStructure, modules, lessons } = req.body;
    // Validate and prepare data based on courseStructure
    // console.log(req.body , )
    let courseDetailsData;
    console.log(courseStructure , "courseStructure")
    if (courseStructure === 'CMLT') {
      // Validate and prepare data for CMLT structure
      courseDetailsData = {
        courseId: courseId,
        courseStructure: courseStructure,
        modules: modules,
        lessons: [],
        // langCode: langCode
      };
    } else if (courseStructure === 'CLT') {
      // Validate and prepare data for CLT structure
      courseDetailsData = {
        courseId: courseId,
        courseStructure: courseStructure,
        modules: [],
        lessons: lessons,
        // langCode: langCode
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


exports.addCoursePage = async (req, res) => {
  try {
    const {
      courseId,
      pageName,
      title,
      pageTemplate,
      htmlTemplate,
      cssTemplate,
      userName,
    } = req.body;

    // Generate image from the HTML and CSS content
    const imageBuffer = await nodeHtmlToImage({
      html: `<html>
               <head>
                 <style>
                   ${cssTemplate}
                 </style>
                 <style>
                   @tailwind base;
                   @tailwind components;
                   @tailwind utilities;
                 </style>
                 <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
               </head>
               <body>
                 ${htmlTemplate}
               </body>
             </html>`,
      encoding: "buffer",
    });

    const base64Image = imageBuffer.toString("base64");
    const imageSrc = `data:image/png;base64,${base64Image}`;

    let CoursePage = await CoursePageBuilder.findOne({ courseId: courseId  });

    if (CoursePage){
      CoursePage = await CoursePageBuilder.findOneAndUpdate({ courseId:courseId }, {
        courseId,
        pageName,
        title,
        pageTemplate,
        htmlTemplate,
        cssTemplate,
        userName,
        // netlifyLink,
        previewImage: imageSrc,
      }, { new: true });
    }
    else{

    // Create a new template in the UserSavedPages category
    const CoursePage = new CoursePageBuilder({
      courseId,
      pageName,
      title,
      pageTemplate,
      htmlTemplate,
      cssTemplate,
      userName,
      // netlifyLink,
      previewImage: imageSrc,
    });

    await CoursePage.save();
  }

    res.status(201).json({
      message: "User saved template added successfully",
      template: CoursePage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllCourseBuilderPages = async (req, res) => {
  console.log("h0")
  try {
    console.log('Fetching course pages...');
    const templates = await CoursePageBuilder.find({});
    // console.log('Course pages fetched:', templates);
    res.status(200).json({
      success: true,
      data: templates,
      message: "Templates fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.log(error.message, "hi");
    console.error('Error fetching course pages:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Add this new function in your controller
// exports.getTemplatesByCourseId = async (req, res) => {
//   console.log('hello!');
//   const { courseId } = req.params; // Get courseId from request parameters
//   console.log("Fetching course pages for courseId:", courseId);

//   try {
//     const templates = await CoursePageBuilder.find({ courseId }); // Fetch templates where courseId matches
//     console.log('Course pages fetched:', templates);

//     res.status(200).json({
//       success: true,
//       data: templates,
//       message: "Templates fetched successfully",
//       statusCode: 200,
//     });
//   } catch (error) {
//     console.error('Error fetching course pages:', error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


exports.getTemplatesByCourseId = async (req, res) => {
  console.log('hello!');
  const { courseId } = req.params; // Get courseId from request parameters
  console.log("Fetching course pages for courseId:", courseId);

  try {
    // Log the entire request parameters
    console.log('Request Params:', req.params);

    // Log a message before querying the database
    console.log('Querying database for courseId:', courseId);

    const templates = await CoursePageBuilder.find({ courseId }); // Fetch templates where courseId matches

    // Log the result of the database query
    console.log('Course pages fetched:', templates);

    res.status(200).json({
      success: true,
      data: templates,
      message: "Templates fetched successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.error('Error fetching course pages:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const mongoose = require('mongoose');
// Fetch courses by instructor _id
exports.getCoursesByInstructor = async (req, res) => {
  const instructorId = req.params.id
  console.log(instructorId , "instructorId")

  try {
    const courses = await Course.aggregate([
      { 
        $match: { 
          'generalInformation.instructorName.id': instructorId 
        } 
      }
    ]);

   return res.status(200).json(courses);
  } catch (error) {
   return  res.status(500).json({ message: 'Error fetching courses', error });
  }
};
