const  BlogsDetails = require('../model/BlogDataSchema')

exports.createBlogData = async (req, res) => {
    console.log(req.body)
    const { title, description, image} = req.body;
    if (!(title && description && image)) {
        return res.json({
            message:"all input field require!"
        })
    }
    try{
        const newData = await BlogsDetails.create(req.body)
        res.status(201).json({
            message:"success",
            Data:newData,
            statusCode:200,
        });
    } catch (err) {
        res.status(400).json({message:err.message});
    }
};

exports.getBlogDdata = async (req, res) => {
    try{
        const blogs = await BlogsDetails.find();
        res.json(
            {
                blogs:blogs,
                statusCode:200,
                message:'data get'
            }
        );
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}