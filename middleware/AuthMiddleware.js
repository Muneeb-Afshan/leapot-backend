const admin = require("../config/firebase-config");

const verifyToken = async (req, res, next) => {
  console.log(req.headers);
  // Extract the token from the request headers
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
    return res.json({ message: "Un authorize" });
  } catch (e) {
    return res.json({ message: "Internal Error" });
  }
};

module.exports = verifyToken;
