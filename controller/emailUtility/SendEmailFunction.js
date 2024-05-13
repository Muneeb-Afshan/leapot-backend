// Function to send email with custom parameters
const createTransporter = require('../emailUtility/Transporter')

async function sendEmail(options) {
    const transporter = createTransporter();
  
    try {
      await transporter.sendMail(options);
      console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  
  module.exports = { sendEmail };