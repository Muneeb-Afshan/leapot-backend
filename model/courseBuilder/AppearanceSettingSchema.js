const mongoose = require('mongoose');

const AppearanceSettingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  theme: {
    type: {
      default: 'light',
      enum: ['light', 'dark']
    }
  },
  primaryColor: {
    type: String
  },
  font: {
    type: String
  },
  langCode:{type: String, required: true , default : "en"}
});

module.exports = mongoose.model('CourseAppearanceSetting', AppearanceSettingSchema);
