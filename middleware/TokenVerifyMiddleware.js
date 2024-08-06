const admin = require('../config/firebase-config.js');

const verifyTokenForAllUrl = async (req, res, next) => {
  console.log("Entered middleware verify token");

  const authHeader = req.headers.authorization;
  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log("Token extracted:",token);//TODO:TOCKEN TILL HERE
  } else {
    console.warn('Authorization header missing or invalid format');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const langCode = req.headers["accept-language"];
  console.log("Language code extracted:", langCode);

  try {
    const decodedValue = await admin.auth().verifyIdToken(token);
    console.log("Token verified successfully. Decoded value:", decodedValue);
    req.user = { ...decodedValue, langCode };
    return next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Firebase ID token expired. Please refresh your token.' });
    } else if (error.code === 'auth/argument-error') {
      return res.status(400).json({ message: 'Invalid token format. Please provide a valid token.' });
    } else {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = verifyTokenForAllUrl;
