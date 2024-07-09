const express = require('express');
const qrCodeController = require('./controllers/qrCodeController');
const sessionController = require('./controllers/sessionController');
const attendanceController = require('./controllers/attendanceController');

const router = express.Router();

// QR Code routes
router.post('/qrcode/generate', qrCodeController.generateQRCode);
router.get('/qrcode/:courseId', qrCodeController.getQRCodes);

// Session routes
router.post('/session/create', sessionController.createSession);
router.get('/session/:courseId', sessionController.getSessions);

// Attendance routes
router.post('/attendance/mark', attendanceController.markAttendance);
router.get('/attendance/:courseId', attendanceController.getAttendance);

module.exports = router;
