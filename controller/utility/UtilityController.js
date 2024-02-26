// controllers/contactController.js

const ContactForm = require('../../model/ContactForm');

exports.ContactForm = async (req, res) => {
    console.log("dgnsdkbdsvbd")
  try {
    const { name, email, subject, message, attachments } = req.body;

    // Create a new contact form submission
    const contactForm = new ContactForm({
      name,
      email,
      subject,
      message,
      attachments
    });

    // Save the submission to the database
    await contactForm.save();

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
