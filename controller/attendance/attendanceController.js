const Attendance = require('../models/Attendance'); 
const Session = require('../models/Session'); 
const User = require('../models/User'); 

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { studentId, sessionId, status } = req.body;
    const student = await User.findById(studentId); 
    if (!student) {
      return res.status(404).json({ message: 'Student not found' }); 
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' }); 
    }

    const attendance = new Attendance({
      student: studentId,
      course: session.course,
      date: session.date,
      status,
      scannedAt: Date.now(),
    });

    await attendance.save(); 
    res.status(201).json({ attendance }); 
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};

// Get attendance for a course
const getAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const attendanceRecords = await Attendance.find({ course: courseId }).populate('student', 'firstname lastname'); // Find attendance records by course ID and populate student details
    res.status(200).json({ attendanceRecords }); // Respond with the attendance records
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle server errors
  }
};

module.exports = { markAttendance, getAttendance };
