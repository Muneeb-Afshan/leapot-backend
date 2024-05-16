// models/statusModel.js
const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Status = mongoose.model('BlaclistedStatusType', statusSchema);

module.exports = Status;
