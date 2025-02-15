// external imports
const express = require('express');

// internal imports
const{getProfile} = require("../controller/profileController");

const router = express.Router();

// login page
router.get("/",getProfile);

module.exports = router;