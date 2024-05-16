const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventAccessibilitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
});

module.exports = mongoose.model('EventAccessibility', eventAccessibilitySchema);
