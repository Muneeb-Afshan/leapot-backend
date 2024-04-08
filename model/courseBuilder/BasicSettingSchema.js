const mongoose = require('mongoose');

const courseBasicSettingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
  }
});

module.exports = mongoose.model('CourseBasicSetting', courseBasicSettingSchema);
