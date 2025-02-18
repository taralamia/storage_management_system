// external imports
const express = require('express');
// internal imports
const {addUserValidators}= require("../middlewares/users/userValidators");
const{} = require("../middlewares/users/sessionMiddleware");
const{getLogin_1,
      addUser,
      googleAuth,
      googleAuthCallback,
      postLogin,
      forgotPassword,
      resetPassword
} = require("../controller/loginController");
const User = require("../models/People");
const router = express.Router();
// login page or get started for free
router.get("/",getLogin_1);
//  POST route for login functionality
router.post("/postLogin",postLogin);
//check user
router.post("/check-user", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(200).json({ message: "User exists", user });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
// create user without google
router.post("/signup",addUserValidators,
    addUser
);
// sign up with google
router.get("/auth/google", googleAuth); 
router.get("/auth/google/callback", googleAuthCallback);

// forget password
router.post("/forget-password",forgotPassword);
//reset password
router.post("/reset-password", resetPassword);

module.exports = router;