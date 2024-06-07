const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: {  type: Schema.Types.ObjectId, ref: 'UserDetails', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'events', required: true },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, 
  text: { type: String },
  attachments: [{ type: String }], 
  timestamp: { type: Date, default: Date.now },
  thumbUps: { type: Number, default: 0 },
  thumbDowns: { type: Number, default: 0 },
  usersVoted: {
    thumbUps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails' }],
    thumbDowns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails' }]
  }
});

module.exports = mongoose.model('Message', messageSchema);