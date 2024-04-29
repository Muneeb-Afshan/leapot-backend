


// code 2

// controllers/contactController.js
const Role = require('../../model/Role');
const sendNotificationEmail = require('./EmailNotification')

const ContactForm = require('../../model/ContactForm');

exports.ContactForm = async (req, res) => {
    console.log("dgnsdkbdsvbd")
  try {
    const { name, email, mobile, message, attachments } = req.body;
    const ownerEmail = 'gauravhiwarale1448@gmail.com';

    // Create a new contact form submission
    const contactForm = new ContactForm({
      name,
      email,
      mobile,
      message,
      attachments
    });
    
    // Save the submission to the database
    await contactForm.save();

    // Send Notificaton to mail
    await sendNotificationEmail(name, email, ownerEmail);

    res.status(201).json({ message: 'Contact form submitted successfully', ContactInfo :contactForm });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
};


// to Add store FAQ 
const FAQ = require('../../model/FAQ');

// Create a new FAQ
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = new FAQ({ question, answer });
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'An error occurred while creating FAQ' });
  }
};

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (error) {
    console.error('Error getting FAQs:', error);
    res.status(500).json({ message: 'An error occurred while getting FAQs' });
  }
};


// controllers/roleController.js

exports.addRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if the role with the same name already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ success: false, message: 'Role with this name already exists' });
    }

    // Create a new role
    const role = new Role({ name, description });
    await role.save();

    return res.status(201).json({ success: true, message: 'Role added successfully', data: role });
  } catch (error) {
    console.error('Error adding role:', error);
    return res.status(500).json({ success: false, message: 'Failed to add role' });
  }
};
