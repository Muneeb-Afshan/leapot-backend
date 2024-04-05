const TestimonialDetail = require('../model/TestimonialsDataSchema')

exports.createTestimonial = async (req, res) => {
    console.log(res.body)
    const {author, description, image} = req.body;
    if (!(author && description && image)) {
        return res.json({
            message:"all input field require"
        })
    }
    try{
        const newData = await TestimonialDetail.create(req.body)
        res.status(201).json({
            message:"success",
            user:req.body
        });
    } catch (err) {
        res.status(400).json({message:err.message});
    }
};


exports.getTestimonialsData = async (req, res) => {
    try{
        const Testimonials = await TestimonialDetail.find();
        res.json(
            {
                Testimonials:Testimonials,
                statusCode:200,
                message:'data get'
            }
        );
    } catch (err) {
        res.status(500).json({message:err.message})
    }
}