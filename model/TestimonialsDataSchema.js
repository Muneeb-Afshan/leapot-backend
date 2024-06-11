const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    author:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
      },
      delete_flag: {
        type: Boolean,
        default: false
      },
      langCode:{type: String, required: true , default : "en"},
})

module.exports = mongoose.model('Testimonial', TestimonialSchema)