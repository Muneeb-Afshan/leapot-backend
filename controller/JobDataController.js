const JobDetails = require('../model/JobDataSchema')

exports.createJobData = async (req, res) =>{
    console.log(req.body)
    const {id, title, description, vacancies, date, joblocation, EmpTime} = req.body;
    if (!(id, title, description, vacancies, date, joblocation,EmpTime)) {
        return res.json({
            message:"all input field require!"
        })
    }
    try{
        const newData = await JobDetails.create(req.body)
        res.status(201).json({
            message:"success",
            Data:newData,
            statusCode:200,
        });
    } catch (err) {
        res.status(400).json({message:err.message});
    }
};


exports.getJobData = async (req, res) => {
    try{
        const jobs = await JobDetails.find();
        res.json(
            {
                jobs:jobs,
                statusCode:200,
                message:'date get'
            }
        );
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}


exports.getJobDataById = async (req, res) => {
    try {
        const jobId = parseInt(req.params.id); 
        const job = await JobDetails.findOne({ id: jobId }); 
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json({ job, statusCode: 200, message: 'Job data retrieved successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
