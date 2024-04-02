const {CertificateTemplate , EventCertificate , IssueCertificate , CertificateSetting} = require('../../model/CertificateSchema');
const User = require("../../model/UserSchema");
const Event = require("../../model/Events")
const BlacklistedUser= require("../../model/BlacklistedUser")
const RegisterLearner = require("../../model/RegistrationSchema")
exports.addTemplate = async(req, res)=>{
    try {
        const templateData = req.body;
        const certificate = await CertificateTemplate.create(templateData);
        return res.status(201).json({
            body : certificate,
            statusCode : 200,
            message :"certificate Added successfully"
        }
            );
      } catch (error) {
        return res.status(500).json('Unable to POST Template');
      }
}


exports.useTemplate = async(req, res)=>{
  try {
      const templateData = req.body;
      const eventcertificate = await EventCertificate.create(templateData);
      return res.status(201).json({
          body : eventcertificate,
          statusCode : 200,
          message :"event certificate  copy successfully"
      }
          );
    } catch (error) {
      return res.status(500).json('Unable to POST Template');
    }
}


exports.editTemplate = async(req,res) => {
    try {
        const { id } = req.params;
        console.log(id)
    
        const result = await EventCertificate.findByIdAndUpdate({_id:id}, req.body ,  { new: true });
    
        if (!result) {
          return res.status(404).json({ message: 'Template not found' });
        }
    
        return res.status(200).send({
            body : result,
            statusCode : 200,
            message: 'Event Certificate  updated successfully' });
      } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: error.message });
      }
}

// Controller function to fetch all templates
exports.getAllTemplates= async(req, res)=> {
  try {
    const templates = await CertificateTemplate.find();
    return res.status(200).send({
      templates : templates,
      statusCode : 200,
      message: 'Template fetched  successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


exports.getAllCertificate= async(req, res)=> {
  try {
    const certificate = await EventCertificate.find();
    return res.status(200).send({
      certificates : certificate,
      statusCode : 200,
      message: 'Event Certificate fetched  successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


exports.getOriantation = async(req,res)=>{
    try {
        const { type, orientation } = req.query;
        if(type || orientation) {
          const certificate = await CertificateTemplate.find({type:type, orientation:orientation});
          console.log(type);
          console.log(orientation);
          return res.status(200).json(certificate);
        } else {
          const certificate = await certificateTemplateSchema.find();
          return res.status(200).json(certificate);
        }
      } catch (error) {
          console.log(error.message);
          res.status(500).send({ message: error.message });
      }
}


// exports.singleIssue = async(req, res)=>{
//   try {
//       const issueData = req.body;
//       const {email , eventName} = req.body ;
//       const eventData = await Event.findOne({EventName:eventName})
//       if(!eventData){
//         return res.status(500).json({
         
//           message :"event name is not found"
//       }
//           );
//       }
    

//       const issue = await IssueCertificate.create(issueData);
//       return res.status(201).json({
//           issueData : issue,
//           statusCode : 200,
//           message :"certificate issued successfully"
//       }
//           );
//     } catch (error) {
//       console.log(error)
//       return res.status(500).json('Unable to issued  certificate');
//     }
// }


exports.singleIssue = async (req, res) => {
  try {
    const issueData = req.body;
    const { email, eventName } = req.body;
    console.log(eventName)
    // Fetch event data
    const eventData = await Event.findOne({ EventName: eventName });
    if (!eventData) {
      return res.status(500).json({ message: "Event name is not found" });
    }

    // Check if the user is registered for the event
    const registrationData = await RegisterLearner.findOne({ email, eventid: eventData._id }).populate('userid');
    console.log(registrationData)
    if (!registrationData) {
      return res.status(400).json({ message: "User is not registered for the event" });
    }

    // const issueCertificate = await IssueCertificate.findOne({ email, eventName: eventName });
    // if (issueCertificate) {
    //   return res.status(400).json({ message: "certificate is already issue to user" });
    // }
    // Proceed with issuing the certificate
    const issue = await IssueCertificate.create({ ...issueData,
      username: registrationData.userid.username});
    return res.status(201).json({
      issueData: issue,
      statusCode: 200,
      message: "Certificate issued successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json('Unable to issue certificate');
  }
}


exports.bulkIssue = async(req, res)=>{
  try {
    
    const { users , eventName , issueDate ,status , serialNumber} = req.body; // Array of user objects to blacklist
    
    const issuedUsers = await IssueCertificate.insertMany(users.map(user => ({
      email: user.email,
      eventName: eventName,
      issueDate: issueDate ,
      serialNumber:serialNumber,
      status: status 

    })));

    return res.status(200).json({
      success: true,
      message: 'Certificate issued to Users successfully',
      statusCode:200,
      data: issuedUsers
    });
  } catch (error) {
    console.error('Error blacklisting users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to blacklist users'
    });
  }

}

// exports.bulkIssue = async (req, res) => {
//   try {
//     const issueDataList = req.body; // Assuming req.body contains an array of issue data
//     const successfulIssues = [];
//     const failedIssues = [];

//     for (const issueData of issueDataList) {
//       const { email, eventName } = issueData;

//       // Fetch event data
//       const eventData = await Event.findOne({ EventName: eventName });
//       if (!eventData) {
//         failedIssues.push({ message: `Event name ${eventName} is not found for email ${email}` });
//         continue; // Continue to the next issueData
//       }

//       // Check if the user is registered for the event
//       const registrationData = await RegisterLearner.findOne({ email, eventid: eventData._id }).populate('userid');
//       if (!registrationData) {
//         failedIssues.push({ message: `User with email ${email} is not registered for the event ${eventName}` });
//         continue; // Continue to the next issueData
//       }

//       const issueCertificate = await IssueCertificate.findOne({ email, eventName: eventName });
//       if (issueCertificate) {
//         failedIssues.push({ message: `Certificate is already issued to user with email ${email} for event ${eventName}` });
//         continue; // Continue to the next issueData
//       }

//       // Proceed with issuing the certificate
//       try {
//         const issue = await IssueCertificate.create({ ...issueData, username: registrationData.userid.username });
//         successfulIssues.push(issue);
//       } catch (error) {
//         failedIssues.push({ message: `Unable to issue certificate for user with email ${email} for event ${eventName}` });
//       }
//     }

//     return res.status(200).json({
//       successfulIssues,
//       failedIssues,
//       message: "Bulk certificate issuance completed"
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json('Unable to issue certificates');
//   }
// }

exports.fetchSetting = async (req, res) => {
  try {
    // Fetch issued certificates from the database
    const certificatesSetting = await CertificateSetting.find();

    // Return the fetched certificates as a response
    return res.status(200).json({
      statusCode: 200,
      data: certificatesSetting,
      message: " certificate Setting  fetched successfully"
    });
  } catch (error) {
    // Handle any errors that occur during fetching
    console.error("Error fetching issued certificates:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error occurred while fetching issued certificates"
    });
  }
};


exports.fetchIssueCertificate = async (req, res) => {
  try {
    // Fetch issued certificates from the database
    const issuedCertificates = await IssueCertificate.find();

    // Return the fetched certificates as a response
    return res.status(200).json({
      statusCode: 200,
      data: issuedCertificates,
      message: "Issued certificates fetched successfully"
    });
  } catch (error) {
    // Handle any errors that occur during fetching
    console.error("Error fetching issued certificates:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error occurred while fetching issued certificates"
    });
  }
};



exports.blacklistUsers = async (req, res) => {
  try {
    
    const { users , reason , status} = req.body; // Array of user objects to blacklist
    // Extract user IDs from the array of user objects
    const email = users.map(user => user.email);
    // Update the users with the provided IDs to set blacklisted to true
    const updatedUsers = await User.updateMany({ email: { $in: email } }, { blacklisted: true });
   
    const insertedUsers = await BlacklistedUser.insertMany(users.map(user => ({
      email: user.email,
      reason: reason,
      status: status ,
      blacklisted: true 

    })));

    return res.status(200).json({
      success: true,
      message: 'Users blacklisted successfully',
      statusCode:200,
      data: updatedUsers
    });
  } catch (error) {
    console.error('Error blacklisting users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to blacklist users'
    });
  }
};


exports.getBlacklistedUsers = async (req, res) => {
  try {
    // Fetch blacklisted users from the database
    const blacklistedUsers = await BlacklistedUser.find({ blacklisted: true });

    // Return the fetched blacklisted users as a response
    return res.status(200).json({
      success: true,
      message: 'Blacklisted users fetched successfully',
      data: blacklistedUsers ,
      statusCode:200
    });
  } catch (error) {
    console.error('Error fetching blacklisted users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blacklisted users'
    });
  }
};