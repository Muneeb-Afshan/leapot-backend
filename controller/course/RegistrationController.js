// controllers/learnerRegistrationController.js

const EventRegistration = require('../../model/RegistrationSchema');

exports.registerLearner = async (req, res) => {
  try {
    const {email, userid, eventid, registrationDate, registrationStatus, courseid, paymentid } = req.body;

    // Check if the learner is already registered for the event or course
    const existingRegistration = await EventRegistration.findOne({ userid, eventid });
    if (existingRegistration) {
      return res.status(400).json({ success: false, message: 'User is already registered for this event or course' });
    }

    // Create a new registration
    const registration = new EventRegistration({
      email,
      userid,
      eventid,
      courseid,
      registrationDate,
      registrationStatus,
      paymentid
    });

    // Save the registration to the database
    await registration.save();

    // Return success response
    return res.status(201).json({ success: true, message: 'Learner registered successfully', data: registration });
  } catch (error) {
    console.error('Error registering learner:', error);
    return res.status(500).json({ success: false, message: 'Failed to register learner' });
  }
};



exports.fetchRegisterLearnerById = async (req, res) => {
  console.log("fetchRegisterLearnerById", req.query); // Log query parameters
  try {
    const userId = req.query.userid; // Extract userid from query parameters
    console.log(userId);

    // Check if userid is not provided
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Find the registrations / enrollment for the user 
    const registrations = await EventRegistration.find({ userid: userId })
      .populate('courseid')
      .exec();

    if (registrations.length === 0) {
      return res.status(200).json({ success: true, message: 'No events registered by this user', events: [] });
    }

    // Extract events from the registrations
    const events = registrations?.map(registration => registration?.courseid);

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error('Error fetching registered events:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

