const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventAffiliationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
});

module.exports = mongoose.model('EventAffiliation', eventAffiliationSchema);
