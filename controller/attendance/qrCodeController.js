const QRCode = require('qrcode'); // QR code generation library
const QRCodeModel = require('../models/QRCode'); // QRCode schema model
const Course = require('../models/Course'); // Course schema model

// Generate QR code for a course
const generateQRCode = async (req, res) => {
  try {
    const { courseId, expiresAt } = req.body;
    const course = await Course.findById(courseId); // Find the course by ID
    if (!course) {
      return res.status(404).json({ message: 'Course not found' }); // Course not found error
    }

    const qrCodeData = `${courseId}-${Date.now()}`; // Create QR code data string
    const qrCodeImage = await QRCode.toDataURL(qrCodeData); // Generate QR code image

    const qrCode = new QRCodeModel({
      course: courseId,
      qrCode: qrCodeImage,
      expiresAt,
    });

    await qrCode.save(); // Save the QR code to the database
    res.status(201).json({ qrCode }); // Respond with the created QR code
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle server errors
  }
};

// Get QR codes for a course
const getQRCodes = async (req, res) => {
  try {
    const { courseId } = req.params;
    const qrCodes = await QRCodeModel.find({ course: courseId }); // Find QR codes by course ID
    res.status(200).json({ qrCodes }); // Respond with the QR codes
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle server errors
  }
};

module.exports = { generateQRCode, getQRCodes };
