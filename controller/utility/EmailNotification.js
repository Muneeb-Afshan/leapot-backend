// const nodemailer = require('nodemailer');
// const ContactForm = require('../../model/ContactForm');

// // Initialize Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'intern.lpt@gmail.com',
//     pass: 'uppm qskv gihw vecc'
//   }
// });

// exports.ContactForm = async (req, res) => {
//   try {
//     const { name, email, mobile, message } = req.body;

//     // Create a new contact form submission
//     const contactForm = new ContactForm({
//       name,
//       email,
//       mobile,
//       message,
//     });

//     // Save the submission to the database
//     await contactForm.save();

//     // Send acknowledgment email to the user
//     await transporter.sendMail({
//       from: 'intern.lpt@gmail.com',
//       to: email,
//       subject: 'Contact Form Submission Received',
//       html: `
//         <p>Dear ${name},</p>
//         <p>Thank you for contacting us. We have received your message and will get back to you shortly.</p>
//         <p>Regards,</p>
//         <p>Your Company Name</p>
//       `
//     });

//     // Send notification email to the owner
//     await transporter.sendMail({
//       from: 'your_gmail_address@gmail.com',
//       to: 'owner_email@example.com', // Replace with owner's email address
//       subject: 'New Contact Form Submission',
//       html: `
//         <p>You have received a new contact form submission:</p>
//         <ul>
//           <li><strong>Name:</strong> ${name}</li>
//           <li><strong>Email:</strong> ${email}</li>
//           <li><strong>Mobile:</strong> ${mobile}</li>
//           <li><strong>Message:</strong> ${message}</li>
//         </ul>
//       `
//     });

//     res.status(201).json({
//       message: 'Contact form submitted successfully',
//       ContactInfo: contactForm,
//     });
//   } catch (error) {
//     console.error('Error submitting contact form:', error);
//     res.status(500).json({ message: 'An error occurred while processing your request' });
//   }
// };
