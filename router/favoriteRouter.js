// external imports
const express = require('express');

// internal imports
const{getFavorite} = require("../controller/favoriteController");

const router = express.Router();

// favorite page
router.get("/",getFavorite);

module.exports = router;