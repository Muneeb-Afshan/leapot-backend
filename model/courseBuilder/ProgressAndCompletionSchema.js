const mongoose = require('mongoose');

const ProgressAndCompletion = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  videoLesson: {
    autoplay: {
      type: Boolean,
      default: false
    },
    autoProgress: {
      type: Boolean,
      default: false
    }
  },
  completion: {
    certificate: {
      type: Boolean,
      default: false
    },
    percentage: {
      type: Number,
      default: 100
    },
    customCompletionPage: {
      type: Boolean,
      default: false
    }
  },
  chapterCompletion: {
    disableMessage: {
      type: Boolean,
      default: false
    },
    enableSocialSharing: {
      type: Boolean,
      default: false
    }
  },
  courseCompletion: {
    enableSocialSharing: {
      type: Boolean,
      default: false
    }
  }
});

module.exports = mongoose.model('CourseProgressAndCompletion', ProgressAndCompletion);
