const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
});

module.exports = mongoose.model('MemberType', memberTypeSchema);
