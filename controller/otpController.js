// controllers/authController.js
const User = require("../model/UserSchema");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hr.leapot@gmail.com",
    pass: "tlnb zajb dnqz katg",
  },
});

exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required", success: false });
  }

  const otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
  });
  const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  try {
    await User.findOneAndUpdate(
      { email },
      { otp, otpExpiration },
      { new: true, upsert: true }
    );
    console.log(`Generated OTP: ${otp}`); // Log the generated OTP

    const mailOptions = {
      from: process.env.EMAIL, // Sender email address
      to: email, // Recipient email address
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`, // OTP message
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending OTP email:", error); // Log the error
        return res
          .status(500)
          .json({ message: "Failed to send OTP", success: false });
      }
      console.log("OTP email sent:", info.response); // Log the success response
      res.status(200).json({ message: "OTP sent successfully", success: true });
    });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.verifyOTP = async (req, res) => {
  console.log("Request body:", req.body); // Log request body
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ message: "Email and OTP are required", success: false });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (user.otp !== otp || new Date() > new Date(user.otpExpiration)) {
      console.log("OTP:", user.otp, "Expiration:", user.otpExpiration); // Log OTP and expiration
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP", success: false });
    }

    // OTP is valid, update user as verified
    await User.findByIdAndUpdate(user._id, { otp: null, otpExpiration: null });

    return res
      .status(200)
      .json({ message: "OTP verified successfully", success: true });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
