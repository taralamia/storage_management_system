// external imports
const express = require('express');

// internal imports
const{getHome} = require("../controller/homeController");

const router = express.Router();

// home page
router.get("/",getHome);

module.exports = router;