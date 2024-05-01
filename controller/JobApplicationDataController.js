const JobApplication = require('../model/JobApplicationSchema');

exports.JobApplication = async (req, res) => {
    console.log("this is job application!")
    try{
        const {title, name, dob, nationality, contactno, email, collegename, yearofpassing, percent, currentpercent, withoutpay, Employmenttype} = req.body;

        const jobApplication = new JobApplication({
            title, 
            name, 
            dob, 
            nationality, 
            contactno, 
            email, 
            collegename, 
            yearofpassing, 
            percent, 
            currentpercent, 
            withoutpay, 
            Employmenttype, 
            // uploadresume 
        });

        await jobApplication.save();

        res.status(201).json({message:'Job application submitted successfully', JobInfo: jobApplication});
    } catch (error) {
        console.error("Error submitting job application:", error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
}