// code 2

// controllers/contactController.js
const Role = require("../../model/Role");
const User = require('../../model/UserSchema'); 
const ContactForm = require("../../model/ContactForm");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hr.leapot@gmail.com",
    pass: "tlnb zajb dnqz katg",
  },
});

exports.ContactForm = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    const contactForm = new ContactForm({
      name,
      email,
      mobile,
      message,
    });

    await contactForm.save();

    await transporter.sendMail({
      from: "hr@leapot.in",
      to: email,
      subject: "Thank You for Your Inquiry!",
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to us! We have received your inquiry and are excited to assist you. Our team will review your message carefully and get back to you as soon as possible.</p>
        <p>In the meantime, if you have any urgent questions or concerns, feel free to contact us directly at +91-7038585222</p>
        <p>Thank you for considering Leapot Technologies!</p>
        <p>Best regards,</p>
        <p>Leapot Technologies</p>
      `,
    });

    // owner
    await transporter.sendMail({
      from: email,
      to: "contact@leapot.in",
      subject: "New Inquiry Received",
      html: `
        <p>Hi,</p>        
        <p>You've got a new inquiry! A user has submitted a message via our website. Please find the details below:</p>        
        <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Mobile:</strong> ${mobile}</li>
        <li><strong>Message:</strong> ${message}</li>
        </ul>
        <p>Please review the inquiry at your earliest convenience and reach out to the user to provide assistance or further information.</p>        
        <p>Thank you for your attention to this matter.</p>        
        <p>Best regards,</p>        
        <p>Leapot Technologies</p>        

      `,
    });

    res.status(201).json({
      message: "Contact form submitted successfully",
      ContactInfo: contactForm,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request" });
  }
};

const Application = require("../../model/CareerSchema");

exports.createApplication = async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res
      .status(201)
      .json({
        message: "Contact form submitted successfully",
        data: application,
        statusCode: 200,
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// to Add store FAQ
const FAQ = require("../../model/FAQ");
const { create } = require("../../model/Instructor");

// Create a new FAQ
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = new FAQ({ question, answer });
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ message: "An error occurred while creating FAQ" });
  }
};

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (error) {
    console.error("Error getting FAQs:", error);
    res.status(500).json({ message: "An error occurred while getting FAQs" });
  }
};

// controllers/roleController.js

exports.addRole = async (req, res) => {
  console.log(req.body, req.user, "addRole");
  try {
    const { name, description, langCode } = req.user; //here we want to add langCode...

    // Check if the role with the same name already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Role with this name already exists",
      });
    }

    // Create a new role
    const role = new Role({ name, description, langCode }); //here we want to add langCode...
    await role.save();

    return res
      .status(201)
      .json({ success: true, message: "Role added successfully", data: role });
  } catch (error) {
    console.error("Error adding role:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to add role" });
  }
};

exports.fetchRole = async (req, res) => {
  try {
    console.log(req.body, "fetch role");
    // const langCode = req.user.langCode;
    // Check if the role with the same name already exists
    const role = await Role.find({});
    return res
      .status(201)
      .json({
        success: true,
        message: "Role fetch successfully 1",
        data: role,
      });
  } catch (error) {
    console.error("Error adding role:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch role" });
  }
};

exports.fetchEmail = async (req, res) => {
  try {
    const users = await User.find({}, 'firstname lastname email'); // Fetching 'firstname', 'lastname', and 'email' fields
    const userData = users.map(user => ({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    }));
    res.json({ users: userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};


// exports.fetchRole = async (req, res) => {
//   try {

// console.log(req.user)
//     // Check if the role with the same name already exists
//     const role = await Role.find();
//     return res.status(201).json({ success: true, message: 'Role fetch successfully', data: role });
//   } catch (error) {
//     console.error('Error adding role:', error);
//     return res.status(500).json({ success: false, message: 'Failed to fetch role' });
//   }
// };

const User = require('../../model/UserSchema'); // Adjust the path as needed

exports.getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'Instructor' }, 'firstname lastname _id role').exec();
    res.status(200).json({data :instructors , success:true ,message:"Role Fetch Successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching instructors', error , success:false });
  }
};
