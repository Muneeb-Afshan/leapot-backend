const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    university: { type: String, required: true },
    // collegePercentage: { type: Number, required: true },
    collegeStartDate: { type: Date, required: true },
    collegeEndDate: { type: Date, required: true },
    // currentYear: { type: Number, required: true },
    // currentPercentage: { type: Number, required: true },
    jobExpectations: { type: String, required: true },
    willingToWorkWithoutPay: { type: Boolean, required: true },
    availabilityInDays: { type: Number, required: true },
    employmentType: { type: String, enum: ['full-time', 'part-time'], required: true }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
