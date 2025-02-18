// external imports
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const crypto = require("crypto");
// internal imports
const User = require("../models/People");
const passport = require("passport"); 
require("../config/passport"); 
const jwt = require("jsonwebtoken");
require('dotenv').config();

// get login page
function getLogin_1(req,res,next){
  // it'll navigate to log in page
  //html response will be handled here
  // layer 1 front end will appear from here
  //res.send('Get Started for free');
  console.log("Get");
  res.status(200).json({
    success: true,
    message: "Welcome to the login route!",
});
}
// post login
async function postLogin(req, res, next) {
  
    try {
      // Check if the user exists
      const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
              success: false,
              message: "User not found. Please sign up.",
            });
          }
      
      // Check if the user signed up with Google (no password)
      if (user.googleId && !user.password) {
        return res.status(400).json({
          success: false,
          message: "This account was created using Google Sign-In. Please use Google to log in.",
        });
      }
  // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials. Please check your email and password.",
        });
      }
  // Create a JWT payload
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
      };
   // Sign the token
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  // Send the token in the response
      res.status(200).json({
        success: true,
        message: "Login successful!",
        token: `Bearer ${token}`,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred during login. Please try again.",
      });
    }
  }
  

// add user
async function addUser(req, res, next) {
  console.log("POST request received");

  // Ensure password and confirmPassword match
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      let newUser = new User({
          username: req.body.name,
          email: req.body.email,
          password: hashedPassword
      });

      console.log("Received body", req.body);

      if (!req.body.password || req.body.password.length === 0) {
          return res.status(400).json({
              success: false,
              message: "Password is required",
          });
      }

      const result = await newUser.save();
      res.status(200).json({
          success: true,
          message: "User was added Successfully!",
      });
  } catch (err) {
      console.error("Error in addUser:", err);
      res.status(500).json({
          errors: {
              common: {
                  msg: "Unknown error occurred!",
              },
          },
      });
  }
}

// sign up with google
function googleAuth(req, res, next) {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
} 

function googleAuthCallback(req, res, next) {
    passport.authenticate("google", async (err, user, info) => {
      if (err || !user) {
        console.error("Google Auth Error:", err || info);
        return res.status(401).json({
          success: false,
          message: "Authentication failed. Please try again.",
        });
      }
  
      console.log("User Authenticated Successfully:", user);
  
      // Instead of redirecting, send JSON response
      return res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          profilePic: user.profilePic,
        },
      });
    })(req, res, next);
  }
  
// forget and reset password
async function forgotPassword(req, res, next) {
    const { email } = req.body;
  
    try {
     const { email, password } = req.body;
  
          if (!email) {
              return res.status(400).json({ message: "Email is required" });
          }
  
          const user = await User.findOne({ email });
  
          if (!user) {
              return res.status(400).json({
                success: false,
                message: "User not found. Please sign up.",
              });
            }
        // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();

    // Save the verification code and its expiration time (e.g., 10 minutes)
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 600000; // 10 minutes

      // Save the user with the reset token
      await user.save();
  
      // Send the reset token to the user's email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASSWORD, 
        },
      });
      
      // Send the verification code to the user's email
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password Reset Verification Code",
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Your verification code is: ${verificationCode}\n\n
          This code will expire in 10 minutes.\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
    
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({
        success: true,
        message: "Password reset email sent. Please check your email.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred. Please try again.",
      });
    }
  }
async function resetPassword(req,res,next){
  
  try {
    const { email,verificationCode,password } = req.body;
    console.log("token ",req.params);
   
    const user = await User.findOne({
      email,
      verificationCode,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token. Please request a new password reset.",
      });
    }
    // Hash the new password
    console.time("Hash password");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    console.timeEnd("Hash password");

     user.verificationCode = undefined;
     user.verificationCodeExpires = undefined;
 
     // Save the updated user
     console.time("Save user"); // Start a timer
     await user.save();
     console.timeEnd("Save user"); // End the timer
     res.status(200).json({
        success: true,
        message: "Password reset successful. You can now log in with your new password.",
      });

     } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
}
function generateVerificationCode() {
    return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit code
  }
module.exports ={
    getLogin_1,
    addUser,
    googleAuth,
    googleAuthCallback,
    postLogin,
    forgotPassword,
    resetPassword
}