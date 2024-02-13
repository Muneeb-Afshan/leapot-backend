const mongoose = require('mongoose');

const EventCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true }, // This field should be unique for each category.
  descriptions: { type: String }, // This field is optional and can store a description of the category.
});

module.exports = mongoose.model('EventCategory', EventCategorySchema);
