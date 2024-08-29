const {
  Templates,
  Certificates,
  IssueCertificate,
  CertificateSetting,
} = require("../../model/CertificateSchema");
const User = require("../../model/UserSchema");
const Event = require("../../model/Events");
const RegisterLearner = require("../../model/RegistrationSchema");
// const RegistrationSchema = require("../../model/RegistrationSchema");
const puppeteer = require("puppeteer-core");
const { install } = require("@puppeteer/browsers");
const nodeHtmlToImage = require("node-html-to-image");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const puppeteerExtra = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const BlacklistCertificate = require("../../model/BlacklistCertificate");

puppeteerExtra.use(StealthPlugin());

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your preferred email service
  auth: {
    user: "hr.leapot@gmail.com", // Your email address from environment variable
    pass: "tlnb zajb dnqz katg", // Your email password or app password
  },
});

exports.addTemplate = async (req, res) => {
  const { certificateBody, certificateName, langCode } = req.body;

  if (!certificateBody || !certificateName) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const browser = await puppeteerExtra.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(certificateBody);
  const imageBuffer = await page.screenshot({ type: "png" });
  await browser.close();

  const base64Image = imageBuffer.toString("base64");
  const imageSrc = `data:image/png;base64,${base64Image}`;

  const templateData = {
    certificateName: certificateName,
    certificateBody: certificateBody,
    certificateImage: imageSrc,
    langCode: langCode,
  };
  Templates.create(templateData)
    .then((certificate) =>
      res.status(201).json({
        body: certificate,
        statusCode: 200,
        message: "Certificate added successfully",
      })
    )
    .catch((err) =>
      res.status(500).json({ message: "Database create failed" })
    );
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
    const { templateData, langCode } = req.body;
    console.log(langCode);
    console.log(templateData, "useTemplate");
    const eventcertificate = await Certificates.create(req.body);
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
    const issueData = req.body;
    console.log("ISSUE DATA:", issueData);

    // Fetch all issued certificates (likely for reference or logging)
    const allUsers = await IssueCertificate.find({});
    console.log("All Users associated with event:", allUsers);

    // Retrieve event data based on event ID
    const eventData = await Event.findById(issueData.eventid);
    if (!eventData) {
      return res.status(404).json({ message: "Event not found" });
    }
    console.log("Event Data:", eventData.EventName);

    // Find the user's registration record for the event
    const registrationData = await RegisterLearner.findOne({
      email: issueData.email,
      eventid: eventData._id,
    }).populate("userid");

    if (!registrationData) {
      return res
        .status(400)
        .json({ message: "User is not registered for the event" });
    }

    // Check if the user is blacklisted
    if (registrationData.blacklisted) {
      return res.status(403).json({
        message: "User is blacklisted and cannot be issued a certificate",
      });
    }

    // Retrieve the certificate setting associated with the event
    const certificateSetting = await CertificateSetting.findOne({
      eventId: eventData._id,
    }).populate("certificateId");

    if (!certificateSetting) {
      return res
        .status(400)
        .json({ message: "Certificate Setting not found for the event" });
    }

    // Check if the user already has a certificate for the event
    const existingCertificate = await IssueCertificate.findOne({
      email: issueData.email,
      eventName: eventData.EventName,
    });

    if (existingCertificate) {
      existingCertificate.issueCount += 1; // Increment the issue count if the certificate already exists
      await existingCertificate.save();
      return res.status(200).json({
        message: "Certificate issue count updated successfully",
        statusCode: 200,
      });
    }

    // Generate the serial number based on the type specified in the certificate settings
    let serialNumber;
    if (certificateSetting.serialNumberType.type === "Random") {
      serialNumber = generateRandomValue();
    } else if (certificateSetting.serialNumberType.type === "Incremental") {
      serialNumber = generateNextNumber(certificateSetting);
      certificateSetting.serialNumberType.nextNumber = serialNumber;
      await certificateSetting.save();
    } else {
      return res.status(400).json({
        message:
          "Invalid serialNumberType. Allowed values are 'Random' and 'Incremental'.",
      });
    }

    // Prepare data for issuing the certificate
    const issue = await IssueCertificate.create({
      ...issueData,
      serialNumber,
      username: registrationData.userid.username,
      eventName: eventData.EventName,
      eventDate: eventData.SDate,
      issueType: "Single",
      issueMethod: issueData.issueMethod || "Manual",
      certificateId: certificateSetting.certificateId._id,
    });

    // Prepare email content
    const mailOptions = {
      from: "hr.leapot@gmail.com",
      to: issueData.email, // Uncomment this line and comment the line below for production
      // to: "atharavuttekar@gmail.com", // Replace with issueData.email for real use
      subject: "Your Certificate",
      text: `Dear ${registrationData.userid.firstname},\n\nCongratulations! Your certificate for the event '${eventData.EventName}' has been issued successfully.\n\nCertificate Serial Number: ${serialNumber}\n\nThank you for participating in the event.\n\nBest Regards,\nYour Organization`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Log email details
    console.log(`Email sent: ${info.response}`);
    console.log(`To: ${issueData.email}`);

    // Respond with success
    return res.status(201).json({
      issueData: issue,
      message: "Certificate issued and email sent successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return res.status(500).json({
      message: "Unable to issue certificate",
      error: error.message,
    });
  }
};

exports.bulkIssue = async (req, res) => {
  try {
    // const issueDataList = []; // Assuming req.body contains an array of issue data
    // const { data, langCode } = req.user;
    const data = req.body;
    console.log("req.user", data);

    const successfulIssues = [];
    const failedIssues = [];

    const issueDataList = await RegisterLearner.find({
      eventid: data.eventid,
    });

    console.log(issueDataList, "issueDataList");
    if (!issueDataList) {
      return res
        .status(400)
        .json({ message: "No User is Register for This event" });
    }

    // Fetch event data
    const eventData = await Event.findOne({ _id: data.eventid });

    const certificateSetting = await CertificateSetting.findOne({
      eventId: eventData._id,
    }).populate("certificateId"); // Populate the certificate data
    const certificate = certificateSetting.certificateId;
    if (!eventData) {
      if (!certificateSetting) {
        return res.status(400).json({ message: "Event Name is not found " });
      }
    }
    if (!certificateSetting) {
      return res
        .status(400)
        .json({ message: "Certificate Setting not found for the event" });
    }
    const eventName = eventData.EventName;
    const issueDate = data.issueDate;
    for (const issueData of issueDataList) {
      const { email } = issueData;

      // Check if the user is registered for the event
      const registrationData = await RegisterLearner.findOne({
        email,
        eventid: data.eventid,
      }).populate("userid");
      console.log(registrationData, "registrationData");
      if (!registrationData) {
        failedIssues.push({
          message: `User with email ${email} is not registered for the event ${eventData.EventName}`,
        });
        continue; // Continue to the next issueData
      }

      const issueCertificate = await IssueCertificate.findOne({
        email,
        eventName: eventData.EventName,
      });
      if (issueCertificate) {
        failedIssues.push({
          message: `Certificate is already issued to ${email}`,
        });
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
        return res.status(400).json({
          message:
            "Invalid serialNumberType. Allowed values are 'Random' and 'Incremental'.",
        });
      }

      // Proceed with issuing the certificate
      try {
        const issue = await IssueCertificate.create({
          email,
          issueDate,
          eventName,
          serialNumber,
          username: registrationData.userid.username,
          eventDate: eventData.SDate,
          issueType: "Bulk",
          issueMethod: issueData.issueMethod || "Manual",
          certificateId: certificate,
        });
        successfulIssues.push({
          message: `Certificate is successful issued to ${email} `,
        });
      } catch (error) {
        console.log(error.message);
        failedIssues.push({
          message: `Unable to issue certificate to ${email}`,
        });
      }
    }

    return res.status(200).json({
      successfulIssues,
      failedIssues,
      message: "Bulk certificate issuance completed",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Unable to issue certificates");
  }
};

exports.fetchSetting = async (req, res) => {
  try {
    // Fetch issued certificates from the database
    const certificatesSetting = await CertificateSetting.find()
      .populate("eventId")
      .populate("certificateId");
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
    const certificatesSetting = await CertificateSetting.find({ _id: id })
      .populate("eventId")
      .populate("certificateId");

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
    return res.status(200).json({
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
    console.log("issue", issuedCertificates);

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

exports.blacklistUsers = async (req, res) => {
  try {
    const { email, reason, disqualifiedBy, event } = req.body;

    console.log("Request received to blacklist user with email:", email);
    console.log("Disqualified by:", disqualifiedBy);
    console.log("Reason for blacklisting:", reason);
    console.log("Event ID:", event);

    // Check if the user exists in the User collection
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("User found in the database:", user);

    // Check if the user is part of the specified event
    const eventRecord = await RegisterLearner.findOne({
      eventid: event,
      email,
    });
    if (!eventRecord) {
      console.log("User is not part of the specified event");
      return res.status(404).json({
        success: false,
        message: "User is not part of the specified event",
      });
    }
    const eventname = eventRecord.eventname;
    console.log("Event name retrieved:", eventname);

    // Convert event to ObjectId and query the blacklist
    const objectId = new mongoose.Types.ObjectId(event);
    console.log("Querying with event:", objectId, "and email:", email);
    const existingBlacklistedUser = await BlacklistCertificate.findOne({
      event: objectId,
      email,
    });
    console.log("Existing blacklisted user:", existingBlacklistedUser);

    if (existingBlacklistedUser) {
      console.log("User already exists in the blacklist");
      return res.status(409).json({
        success: false,
        message: "User already exists in the blacklist",
      });
    }

    // Retrieve certificate to add watermark
    const certificate = await IssueCertificate.findOne({
      email,
      eventName: eventname,
    });

    if (certificate) {
      const certificateId = certificate.certificateId;
      if (certificateId) {
        console.log("Certificate found:", certificate);

        // Check if the certificate ID is present in the Certificates collection
        const certificateRecord = await Certificates.findOne({
          _id: certificateId,
        });
        if (certificateRecord) {
          console.log("Certificate settings found:", certificateRecord);

          // Add watermark to the certificate body
          const updatedCertificateBody =
            certificateRecord.certificateBody.replace(
              "</div>",
              '<div style="position: absolute; bottom: 10px; right: 10px; font-size: 36px; color: red; opacity: 0.5;">INVALID</div></div>'
            );

          // Update the certificate with the watermark
          await Certificates.updateOne(
            { _id: certificateId },
            { certificateBody: updatedCertificateBody }
          );
          console.log("Certificate watermark added and updated");
        } else {
          console.log("Certificate ID not found in certificate settings");
          return res.status(404).json({
            success: false,
            message: "Certificate ID not found in certificate settings",
          });
        }
      }
    }

    // Update the blacklisted field in the RegisterLearner schema to true
    await RegisterLearner.updateOne(
      { email, eventid: event },
      { blacklisted: true }
    );
    console.log("RegisterLearner blacklisted field updated to true");

    // Create a new blacklisted user record
    const data = await BlacklistCertificate.create({
      email,
      reason,
      disqualifiedBy,
      eventname,
      createdAt: new Date(),
      certificateId: certificate ? certificate.certificateId : null,
      event: objectId, // Ensure event is ObjectId
    });
    console.log("Blacklisted user record created:", data);

    return res.status(200).json({
      success: true,
      message: "User blacklisted successfully",
      data,
    });
  } catch (error) {
    console.error("Error blacklisting user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to blacklist user",
    });
  }
};

exports.GetBlacklistedCertificate = async (req, res) => {
  try {
    // Fetch blacklisted users from the database
    const blacklistedUsers = await BlacklistCertificate.find({});

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
exports.UpdateBlacklistedUsers = async (req, res) => {
  try {
    const { email } = req.params;
    const { reason, disqualifiedBy } = req.body;

    console.log("Request parameters:", req.params);
    console.log("Request body:", req.body);

    // Find the blacklisted user by email
    const existingBlacklistedUser = await BlacklistCertificate.findOne({
      email,
    });

    if (!existingBlacklistedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found in blacklist",
      });
    }

    // Update the blacklisted user
    const updatedUser = await BlacklistCertificate.findOneAndUpdate(
      { email },
      { reason, disqualifiedBy, updatedAt: new Date() },
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      success: true,
      message: "Blacklisted user updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating blacklisted user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blacklisted user",
    });
  }
};
exports.deleteblacklistUsers = async (req, res) => {
  try {
    const { email } = req.params;

    // Find and delete the blacklisted user by email
    const result = await BlacklistCertificate.findOneAndDelete({ email });
    console.log(`email${email} req${result}`);
    // If the blacklisted user doesn't exist, return 404 Not Found
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found in blacklist",
      });
    }

    // Remove the blacklisted status from the User collection
    await User.updateOne({ email }, { blacklisted: false });

    return res.status(200).json({
      success: true,
      message: "Blacklisted user removed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting blacklisted user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blacklisted user",
    });
  }
};
