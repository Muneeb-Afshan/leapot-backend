const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    id:{
        type:Number,
        require:true,
    },
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    vacancies:{
        type:Number,
        require:true,
    },
    date:{
        type:String,
        require:true,
    },
    joblocation:{
        type:String,
        require:true,
    },
    EmpTime:{
        type:String,
        require:true,
    },
    dateB: {
        type: Date,
        default: Date.now
      },
    delete_flag: {
        type: Boolean,
        default: false
      }
});

module.exports = mongoose.model('Job', jobSchema);