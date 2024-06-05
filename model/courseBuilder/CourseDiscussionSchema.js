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

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const messageSchema = new Schema({
//   course: { type: mongoose.Schema.Types.ObjectId,ref: 'events',  required: true },
//   sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   text: { type: String },
//   attachments: [{ type: String }], 
//   timestamp: { type: Date, default: Date.now },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
//   replyTo: [{
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     content: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
//   }]
// });

// module.exports = mongoose.model('Message', messageSchema);
