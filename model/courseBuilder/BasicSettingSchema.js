const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const courseBasicSettingSchema = new mongoose.Schema({
  courseId: {
    type: Schema.Types.ObjectId, ref:'Course'
  },
  contentScheduling: {
    type: Boolean,
    default: false
  },
  sequentialLearningPath: {
    type: Boolean,
    default: false
  },
  enforceCompleteVideoViewing: {
    type: Boolean,
    default: false
  },
  completionPercentage: {
    type: Number,
    default: 90
  },
  security: {
    type: {
      disableTextCopying: {
        type: Boolean,
        default: false
      },
      showLearnerCount: {
        type: Boolean,
        default: false
      },
      showValidity: {
        type: Boolean,
        default: false
      },
      showCourseInfo: {
        type: Boolean,
        default: false
      },
      allowBookmarking: {
        type: Boolean,
        default: false
      }
    }
  },
  langCode:{type: String, required: true , default : "en"}
});

module.exports = mongoose.model('CourseBasicSetting', courseBasicSettingSchema);
