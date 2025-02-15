// external imports
const express = require('express');

// internal imports
const{getCalendar} = require("../controller/calendarController");

const router = express.Router();

// Calendar page
router.get("/",getCalendar);

module.exports = router;