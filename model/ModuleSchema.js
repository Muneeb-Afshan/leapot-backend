const mongoose = require('mongoose');

const EventModulesSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId,ref: 'Event', required: true },
  title: { type: String, required: true },
  order: { type: Number, required: true },
  sequence: { type: Number, required: true },
  langCode:{type: String, required: true , default : "en"},
});

module.exports = mongoose.model('EventModules', EventModulesSchema);
