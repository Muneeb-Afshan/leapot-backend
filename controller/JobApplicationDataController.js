const JobApplication = require('../model/JobApplicationSchema');
const {sendEmail} = require('./emailUtility/SendEmailFunction')

exports.JobApplication = async (req, res) => {
    console.log("this is job application!")
    try{
        const {title, name, dob, nationality, contactno, email, collegename, yearofpassing, percent, currentpercent, withoutpay, Employmenttype , resumeLink} = req.body;

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
            // currentpercent, 
            withoutpay, 
            Employmenttype, 
            resumeLink
            // uploadresume 
        });

        await jobApplication.save();
        
        const emailOptions = {
            from: '"Leapot Technologies" <hr@leapot.in>',
            to: email,
            subject: 'Thank You for Applying!',
            text: "",
            html: `<p><span style="font-size:11pt;">Dear ${name},</span></p>
            <p><br></p>
            <p><span style="font-size:11pt;">Greetings of the day! We wanted to take a moment to express our gratitude for your recent application for the&nbsp;</span><span style="background-color:#ffff00;font-size:11pt;">${title}</span><span style="font-size:11pt;">&nbsp;role here at Leapot Technologies. We appreciate the time and effort you&apos;ve invested in applying for the position.</span></p>
            <p><br></p>
            <p><span style="font-size:11pt;">Your application is important to us, and we are currently reviewing it carefully to assess how your skills, experience, and qualifications align with the requirements of the role. We understand that waiting can be challenging, but please rest assured that we are diligently working through the applications.</span></p>
            <p><br></p>
            <p><span style="font-size:11pt;">Should your qualifications match what we&apos;re looking for, we will reach out to you to schedule an interview or to request further information. In the meantime, feel free to explore more about our company and the work we do on our website or social media channels.</span></p>
            <p><br></p>
            <p><span style="font-size:11pt;">Once again, thank you for considering a career opportunity with us. We appreciate your interest in joining our team.</span></p>
            <p><br></p>
            <p><span style="font-size:11pt;">Best regards,</span></p>
            <p><br></p>
            <p><span style="font-size:11pt;">HR</span></p>
            <p><span style="font-size:11pt;">Leapot Technologies</span></p>
            <p><a href="mailto:hr@leapot.in"><u><span style="color:#1155cc;font-size:11pt;">hr@leapot.in</span></u></a></p>`
         
          };
          
          // Call the sendEmail function with the email options
           await sendEmail(emailOptions);

          const HRemailOptions = {
            from: '"Leapot Technologies" <hr@leapot.in>',
            to: 'hr.leapot@gmail.com',
            subject: ' New Job Application Received',
            text: `Hi,
            You've got a new job application! A user has submitted a job application via our website. Please find the details below:
            Title : ${title}
            Name: ${name}
            Email: =${email}
            Phone: ${contactno}
            
            Resume: ${resumeLink}
            
            Please review the job application at your earliest convenience and reach out to the user to provide assistance or further information.
            Thank you for your attention to this matter.
            
            Best regards,
            Leapot Technologies
            `,
            html: `` }
         await sendEmail(HRemailOptions);



        res.status(201).json({message:'Job application submitted successfully', JobInfo: jobApplication});
    } catch (error) {
        console.error("Error submitting job application:", error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
}