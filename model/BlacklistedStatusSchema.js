// models/statusModel.js
const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    langCode:{type: String, required: true , default : "en"}
});

const Status = mongoose.model('BlaclistedStatusType', statusSchema);

module.exports = Status;
