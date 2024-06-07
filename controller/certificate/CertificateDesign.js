const {
  Templates,
  Certificates,
  IssueCertificate,
  CertificateSetting,
} = require("../../model/CertificateSchema");
const User = require("../../model/UserSchema");
const Event = require("../../model/Events");
const BlacklistedUser = require("../../model/BlacklistedUser");
const RegisterLearner = require("../../model/RegistrationSchema");
// const RegistrationSchema = require("../../model/RegistrationSchema");
const nodeHtmlToImage = require('node-html-to-image')

// Adjust the import according to your project structure



exports.addTemplate = async (req, res) => {
  try {
    console.log(req.body, "addTemplate");

    const { certificateBody, certificateName , langCode } = req.user;
    console.log(langCode)
    const imageBuffer = await nodeHtmlToImage({
      html: certificateBody,
      encoding: 'buffer' // Ensures the output is a buffer
    });
    const base64Image = imageBuffer.toString('base64');
    const imageSrc = `data:image/png;base64,${base64Image}`;
    // console.log(imageSrc , "imageSrc")
    const templateData = {
      certificateName: certificateName,
      certificateBody: certificateBody,
      certificateImage: imageSrc, // Store the image buffer
      langCode : langCode
    };
    const certificate = await Templates.create(templateData);

    return res.status(201).json({
      body: certificate,
      statusCode: 200,
      message: "Certificate added successfully"
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Unable to POST Template");
  }
};

// Controller method to logically delete a template
exports.logicalDeleteTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;

    // Find the template by ID and update it
    const updatedTemplate = await Templates.findOneAndUpdate(
      { _id: templateId },
      { $set: { isDeleted: true } },
      { new: true } // Return the updated document
    );

    // If the template doesn't exist, return 404 Not Found
    if (!updatedTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Respond with success message
    return res
      .status(200)
      .json({ message: "Template deleted", template: updatedTemplate });
  } catch (error) {
    // Handle any errors
    console.error("Error in logicalDeleteTemplate:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.useTemplate = async (req, res) => {
  try {
    const { templateData, langCode } = req.user;
    console.log(langCode);
    console.log(templateData ,"useTemplate" )
    const eventcertificate = await Certificates.create(req.user);
    return res.status(201).json({
      body: eventcertificate,
      statusCode: 200,
      message: " certificate  copy successfully from template",
    });
  } catch (error) {
    return res.status(500).json("Unable to POST Template");
  }
};

exports.editCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    // var serializedObj = JSON.stringify(req.body);
    console.log("XYZ", req.body);
    const result = await Certificates.findByIdAndUpdate(
      { _id: id },
      { certificateBody: req.body.template },
      { new: true }
    );
    // console.log("result", result);
    if (!result) {
      return res.status(404).json({ message: "certficate not found" });
    }

    return res.status(200).send({
      body: result,
      statusCode: 200,
      message: " Certificate  updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
};

exports.logicalDeleteCertificate = async (req, res) => {
  try {
    const certificateId = req.params.id;

    // Find the template by ID and update it
    const DeleteCertificate = await Certificates.findOneAndUpdate(
      { _id: certificateId },
      { $set: { isDeleted: true } },
      { new: true } // Return the updated document
    );

    // If the template doesn't exist, return 404 Not Found
    if (!DeleteCertificate) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Respond with success message
    return res
      .status(200)
      .json({ message: "Certificate deleted", template: DeleteCertificate });
  } catch (error) {
    // Handle any errors
    console.error("Error in logicalDeleteTemplate:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to fetch all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Templates.find({ isDeleted: false });
  
    return res.status(200).send({
      templates: templates,
      statusCode: 200,
      message: "Template fetched  successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCertificate = async (req, res) => {
  try {
    const certificate = await Certificates.find({ isDeleted: false });
    return res.status(200).send({
      certificates: certificate,
      statusCode: 200,
      message: " Certificates fetched  successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSingleCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    const certificate = await Certificates.find({ _id: id });
    return res.status(200).send({
      certificates: certificate,
      statusCode: 200,
      message: " Certificates fetched  successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOriantation = async (req, res) => {
  try {
    const { type, orientation } = req.query;
    if (type || orientation) {
      const certificate = await Templates.find({
        type: type,
        orientation: orientation,
      });
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
};

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

// Define generateRandomValue function
function generateRandomValue() {
  // Generate a random number between 100,000 (1 lakh) and 1,000,000 (10 lakhs)
  const randomValue = Math.floor(100000 + Math.random() * 900000);
  return randomValue.toString(); // Convert the number to string
}

// Define generateNextBumber function
function generateNextBumber(certificateSetting) {
  // Increment the next number based on your logic
  certificateSetting.serialNumberType.nextNumber++;
  return certificateSetting.serialNumberType.nextNumber;
}

exports.singleIssue = async (req, res) => {
  try {
    // const { issueData, langCode } = req.user;
    const issueData = req.user 
    console.log(issueData)
    // Fetch event data
    const eventData = await Event.findOne({ EventName: issueData.eventName });
    if (!eventData) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is registered for the event
    const registrationData = await RegisterLearner.findOne({
      email: issueData.email,
      eventid: eventData._id,
    }).populate("userid");
    if (!registrationData) {
      return res
        .status(400)
        .json({ message: "User is not registered for the event" });
    }

    const certificateSetting = await CertificateSetting.findOne({
      eventId: eventData._id,
    });
    if (!certificateSetting) {
      return res
        .status(400)
        .json({ message: "Certificate Setting not found for the event" });
    }

    const existingCertificate = await IssueCertificate.findOne({
      email: issueData.email,
      eventName: issueData.eventName
    })
    if (existingCertificate) {
      return res
        .status(400)
        .json({ message: "Certificate has already issue to user  for the event" });
    }
    // Generate serial number based on serial number type
    let serialNumber;
    if (certificateSetting.serialNumberType.type === "Random") {
      serialNumber = generateRandomValue();
    } else if (certificateSetting.serialNumberType.type === "Incremental") {
      serialNumber = generateNextBumber(certificateSetting);
      console.log(serialNumber);
      certificateSetting.serialNumberType.nextNumber = serialNumber;
      await certificateSetting.save();
    } else {
      return res
        .status(400)
        .json({
          message:
            "Invalid serialNumberType. Allowed values are 'Random' and 'Incremental'.",
        });
    }

    // Issue certificate
    const issue = await IssueCertificate.create({
      ...issueData,
      serialNumber,
      username: registrationData.userid.username,
    });

    return res.status(201).json({
      issueData: issue,
      message: "Certificate issued successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to issue certificate" });
  }
};

// exports.bulkIssue = async (req, res) => {
//   try {
//     const { users, eventName, issueDate, status, serialNumber } = req.body; // Array of user objects to blacklist

//     const issuedUsers = await IssueCertificate.insertMany(
//       users.map((user) => ({
//         email: user.email,
//         eventName: eventName,
//         issueDate: issueDate,
//         serialNumber: serialNumber,
//         status: status,
//       }))
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Certificate issued to Users successfully",
//       statusCode: 200,
//       data: issuedUsers,
//     });
//   } catch (error) {
//     console.error("Error blacklisting users:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to blacklist users",
//     });
//   }
// };

exports.bulkIssue = async (req, res) => {
  try {
    // const issueDataList = []; // Assuming req.body contains an array of issue data
    // const { data, langCode } = req.user;
    const data  = req.user;
    console.log("req.user" ,data )

    const successfulIssues = [];
    const failedIssues = [];
 
    const issueDataList = await RegisterLearner.find({
      eventid: data.eventid,
    }); 

    console.log(issueDataList, "issueDataList")
    if (!issueDataList) {
      return res
        .status(400)
        .json({ message: "No User is Register for This event" });
    }
    const certificateSetting = await CertificateSetting.findOne({
      eventId: data.eventid,
    });

    if (!certificateSetting) {
      return res
        .status(400)
        .json({ message: "Certificate Setting not found for the event" });
    }


  // Fetch event data
  const eventData = await Event.findOne({ _id: data.eventid });
  if (!eventData) {
    if (!certificateSetting) {
      return res
        .status(400)
        .json({ message: "Event Name is not found " });
    }

  } 
  const eventName = eventData.EventName
  const issueDate = data.issueDate
    for (const issueData of issueDataList) {
      const { email } = issueData;

    

      // Check if the user is registered for the event
      const registrationData = await RegisterLearner.findOne({ email, eventid: data.eventid  }).populate('userid');
      console.log(registrationData , "registrationData")
      if (!registrationData) {
        failedIssues.push({ message: `User with email ${email} is not registered for the event ${eventData.EventName}` });
        continue; // Continue to the next issueData
      }

      const issueCertificate = await IssueCertificate.findOne({ email, eventName: eventData.EventName});
      if (issueCertificate) {
        failedIssues.push({ message: `Certificate is already issued to ${email}` });
        continue; // Continue to the next issueData
      }
      // Generate serial number based on serial number type
      let serialNumber;
      if (certificateSetting.serialNumberType.type === "Random") {
        serialNumber = generateRandomValue();
      } else if (certificateSetting.serialNumberType.type === "Incremental") {
        serialNumber = generateNextBumber(certificateSetting);
        console.log(serialNumber);
        certificateSetting.serialNumberType.nextNumber = serialNumber;
        await certificateSetting.save();
      } else {
        return res
          .status(400)
          .json({
            message:
              "Invalid serialNumberType. Allowed values are 'Random' and 'Incremental'.",
          });
      }

      // Proceed with issuing the certificate
      try {
        const issue = await IssueCertificate.create({ email ,  issueDate , eventName, serialNumber, username: registrationData.userid.username });
        successfulIssues.push({ message: `Certificate is successful issued to ${email} ` });
      } catch (error) {
        console.log(error.message)
        failedIssues.push({ message: `Unable to issue certificate to ${email}` });
      }
    }

    return res.status(200).json({
      successfulIssues,
      failedIssues,
      message: "Bulk certificate issuance completed"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json('Unable to issue certificates');
  }
}

exports.fetchSetting = async (req, res) => {
  try {
    // Fetch issued certificates from the database
    const certificatesSetting = await CertificateSetting.find().populate(
      "eventId"      
    ).populate("certificateId");
    console.log(certificatesSetting);

    // Return the fetched certificates as a response
    return res.status(200).json({
      statusCode: 200,
      data: certificatesSetting,
      message: " certificate Setting  fetched successfully",
    });
  } catch (error) {
    // Handle any errors that occur during fetching
    console.error("Error fetching issued certificates:", error);
    return res.status(500).json({
      statusCode: 500,
      message:
        "Internal server error occurred while fetching issued certificates",
    });
  }
};

exports.fetchSingleSetting = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch issued certificates from the database
    const certificatesSetting = await CertificateSetting.find({ _id: id }).populate(
      "eventId"      
    ).populate("certificateId");

    // Return the fetched certificates as a response
    return res.status(200).json({
      statusCode: 200,
      data: certificatesSetting,
      message: " certificate Setting  fetched successfully",
    });
  } catch (error) {
    // Handle any errors that occur during fetching
    console.error("Error fetching issued certificates:", error);
    return res.status(500).json({
      statusCode: 500,
      message:
        "Internal server error occurred while fetching issued certificates",
    });
  }
};

exports.DeleteSettingOfEvent = async (req, res) => {
  try {
    const CertificateSettingId = req.params.id;

    // Find the template by ID and update it
    const DeleteCertificateSetting = await CertificateSetting.findOneAndUpdate(
      { _id: CertificateSettingId },
      { $set: { isDeleted: true } },
      { new: true } // Return the updated document
    );

    // If the template doesn't exist, return 404 Not Found
    if (!DeleteCertificateSetting) {
      return res
        .status(404)
        .json({ error: "Certificate setting is  not found" });
    }

    // Respond with success message
    return res
      .status(200)
      .json({
        message: "Certificate Setting deleted",
        template: DeleteCertificateSetting,
      });
  } catch (error) {
    // Handle any errors
    console.error("Error in DeleteCertificateSetting:", error);
    return res.status(500).json({ error: "Internal server error" });
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
      message: "Issued certificates fetched successfully",
    });
  } catch (error) {
    // Handle any errors that occur during fetching
    console.error("Error fetching issued certificates:", error);
    return res.status(500).json({
      statusCode: 500,
      message:
        "Internal server error occurred while fetching issued certificates",
    });
  }
};

// exports.blacklistUsers = async (req, res) => {
//   try {

//     const { users , reason , status} = req.body; // Array of user objects to blacklist
//     // Extract user IDs from the array of user objects
//     const email = users.map(user => user.email);
//     // Update the users with the provided IDs to set blacklisted to true
//     const updatedUsers = await User.updateMany({ email: { $in: email } }, { blacklisted: true });

//     const insertedUsers = await BlacklistedUser.insertMany(users.map(user => ({
//       email: user.email,
//       reason: reason,
//       status: status ,
//       blacklisted: true

//     })));

//     return res.status(200).json({
//       success: true,
//       message: 'Users blacklisted successfully',
//       statusCode:200,
//       data: updatedUsers
//     });
//   } catch (error) {
//     console.error('Error blacklisting users:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to blacklist users'
//     });
//   }
// };

exports.blacklistUsers = async (req, res) => {
  try {
    const { email, reason, status } = req.body; // Array of user objects to blacklist
    // Extract user IDs from the array of user objects

    const data= await BlacklistedUser.create(req.user);

    return res.status(200).json({
      success: true,
      message: "Users blacklisted successfully",
      statusCode: 200,
      data: data,
    });
  } catch (error) {
    console.error("Error blacklisting users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to blacklist users",
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
      message: "Blacklisted users fetched successfully",
      data: blacklistedUsers,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error fetching blacklisted users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blacklisted users",
    });
  }
};
