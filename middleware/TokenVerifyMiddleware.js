const admin = require("../config/firebase-config");

const verifyTokenForAllUrl = async (req, res, next) => {
  console.log("geloo from middelware")
  console.log(req.body , "verifyTokenForAllUrl")
  console.log(req.headers);
  // Extract the token from the request headers
  const token = req.headers.authorization.split(" ")[1];
  console.log(token , "token")
  const langCode = req.headers['accept-language'];
  console.log(langCode , "verifyTokenForAllUrl")
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    console.log(decodeValue , "decodeValue")
    if (decodeValue) {
console.log("inside clg")
      req.user = {...req.body  , langCode : langCode};
      return next();
    }
    return res.json({ message: "Un authorize" });
  } catch (e) {
    console.log(e.message)
    return res.json({ message: "Internal Error" });
  }
};

module.exports = verifyTokenForAllUrl;
