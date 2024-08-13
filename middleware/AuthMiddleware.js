const admin = require("../config/firebase-config");

const verifyToken = async (req, res, next) => {
  console.log("geloo from middelware auth token")
  console.log(req.headers);
  // Extract the token from the request headers
  const token = req.headers.authorization.split(" ")[1];
  
  console.log(token , "token from auth");

  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    console.log(decodeValue ,"decodeValue")
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }else{

      return res.json({ message: "Un authorize" });
    }
  } catch (e) {
    console.log(e.message , "hbj")
    return res.json({ message: "Internal Error" });
  }
};

module.exports = verifyToken;