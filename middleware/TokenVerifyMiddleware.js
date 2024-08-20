const admin = require("../config/firebase-config");

const verifyTokenForAllUrl = async (req, res, next) => {

  console.log(req.body, "verifyTokenForAllUrl");
  console.log(req.headers, "headers");

  // Check if authorization header is present
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  // Extract the token from the authorization header
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  console.log(token, "token");
  const langCode = req.headers["accept-language"];
  console.log(langCode, "verifyTokenForAllUrl");
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    console.log(decodeValue, "decodeValue");

    if (decodeValue) {
      console.log("inside clg");
      req.user = { ...req.body, langCode: langCode, email: decodeValue.email }; // Include email in req.user
      console.log(req.user, "req.user in middleware"); // Log req.user to verify it includes email
      return next();
    }

    return res.status(401).json({ message: "Unauthorized user" });
  } catch (e) {
    console.log(e.message, "Error from verify token");
    return res.status(500).json({ message: "Internal Error" });
  }
};

module.exports = verifyTokenForAllUrl;