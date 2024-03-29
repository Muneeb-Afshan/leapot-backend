const mongoose = require('mongoose');

const LearnerToCourseRegistration = new mongoose.Schema({
  email:{type:String} ,
  userid: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true }, // This field should be a reference to the User model.
  eventid: { type: mongoose.Schema.Types.ObjectId,ref:'events', required: true }, // This field should be a reference to the Event model.
  registrationDate: { type: Date, required: true },
  cancelled: { type: Boolean, default: false },
  cancellationDate: Date,
  cancellationReason: { type: mongoose.Schema.Types.ObjectId, required: false }, // This field may not be required if a registration is not cancelled.
  registrationStatus: { type: Boolean, required: true },
  paymentid: { type: mongoose.Schema.Types.ObjectId, required: true }, // This field should be a reference to the Payment model.
});

module.exports = mongoose.model('Registration',LearnerToCourseRegistration);
