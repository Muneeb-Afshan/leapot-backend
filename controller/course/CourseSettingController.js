const CourseBasicSetting = require('../../model/courseBuilder/BasicSettingSchema');
const CourseAppearanceSetting = require('../../model/courseBuilder/AppearanceSettingSchema');
const CourseProgressAndCompletion = require('../../model/courseBuilder/ProgressAndCompletionSchema');

// Controller function to save or update course basic setting data
exports.saveOrUpdateCourseBasicSetting = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if course basic setting data with the given name already exists
    let courseBasicSetting = await CourseBasicSetting.findOne({ name });

    // If course basic setting data exists, update it; otherwise, create a new one
    if (courseBasicSetting) {
      // Update the existing course basic setting data
      courseBasicSetting = await CourseBasicSetting.findOneAndUpdate({ name }, req.body, { new: true });
    } else {
      // Create a new instance of CourseBasicSetting model
      courseBasicSetting = new CourseBasicSetting(req.body);

      // Save the course basic setting data to the database
      courseBasicSetting = await courseBasicSetting.save();
    }

    res.status(200).json(courseBasicSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to save or update appearance setting data
exports.saveOrUpdateCourseAppearanceSetting = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if appearance setting data with the given name already exists
    let appearanceSetting = await CourseAppearanceSetting.findOne({ name });

    // If appearance setting data exists, update it; otherwise, create a new one
    if (appearanceSetting) {
      // Update the existing appearance setting data
      appearanceSetting = await CourseAppearanceSetting.findOneAndUpdate({ name }, req.body, { new: true });
    } else {
      // Create a new instance of CourseAppearanceSetting model
      appearanceSetting = new CourseAppearanceSetting(req.body);

      // Save the appearance setting data to the database
      appearanceSetting = await appearanceSetting.save();
    }

    res.status(200).json(appearanceSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to save or update progress and completion data
exports.saveOrUpdateProgressAndCompletion = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if progress and completion data with the given name already exists
    let progressAndCompletion = await CourseProgressAndCompletion.findOne({ name });

    // If progress and completion data exists, update it; otherwise, create a new one
    if (progressAndCompletion) {
      // Update the existing progress and completion data
      progressAndCompletion = await CourseProgressAndCompletion.findOneAndUpdate({ name }, req.body, { new: true });
    } else {
      // Create a new instance of CourseProgressAndCompletion model
      progressAndCompletion = new CourseProgressAndCompletion(req.body);

      // Save the progress and completion data to the database
      progressAndCompletion = await progressAndCompletion.save();
    }

    res.status(200).json(progressAndCompletion);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





