// const nodemailer = require('nodemailer');

// const sendNotificationEmail = async (senderName, senderEmail, ownerEmail) => {
//   try {
//     console.log('Starting sendNotificationEmail function...');

//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: 'gauravhiwarale01@gmail.com', 
//         pass: 'Home123@gaurav' 
//       }
//     });
    
//     console.log('Nodemailer transporter created...');

//     const mailOptions = {
//       from: senderEmail, 
//       to: ownerEmail, 
//       subject: 'New Contact Form Submission',
//       text: `You have a new contact form submission from ${senderName} (${senderEmail}).` // Notification message with sender's name and email
//     };

//     console.log('Mail options composed:', mailOptions);

//     await transporter.sendMail(mailOptions);
//     console.log('Notification email sent successfully');
//   } catch (error) {
//     console.error('Error sending notification email:', error);
//     console.error(error.stack);
//   }
// };

// module.exports = sendNotificationEmail;
