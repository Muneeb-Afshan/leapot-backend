// emailUtils.js

const nodemailer = require('nodemailer');

// Function to create and configure the transporter
function createTransporter() {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'hr.leapot@gmail.com',
      pass: 'tlnb zajb dnqz katg'
    }
  });
}

module.exports = createTransporter;
