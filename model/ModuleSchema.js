const mongoose = require('mongoose');

const EventModulesSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId,ref: 'Event', required: true },
  title: { type: String, required: true },
  order: { type: Number, required: true },
  sequence: { type: Number, required: true },
});

module.exports = mongoose.model('EventModules', EventModulesSchema);
