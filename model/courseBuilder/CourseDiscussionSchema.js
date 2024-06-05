const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'events', required: true },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, 
  text: { type: String },
  attachments: [{ type: String }], 
  timestamp: { type: Date, default: Date.now },
  thumbUps: { type: Number, default: 0 },
  thumbDowns: { type: Number, default: 0 },
});

module.exports = mongoose.model('Message', messageSchema);
