// external imports
const express = require('express');
const router = express.Router();
// internal imports
const avatarUpload = require("../middlewares/users/avatarUpload");
const notesUpload = require("../middlewares/users/notesUpload");
const authMiddleware = require("../middlewares/users/authMiddleware");
const pdfUpload = require("../middlewares/users/pdfUpload");

const{
    uploadAvatar,
    uploadNotes,
    uploadPdf,
    createFolder
} = require("../controller/homeController");

// notes 
router.post("/itemsUpload",authMiddleware,notesUpload,uploadNotes);
// image
router.post("/imageUpload",authMiddleware,avatarUpload,uploadAvatar);
// pdf
router.post("/pdfUpload",authMiddleware,pdfUpload,uploadPdf);
// folder
router.post("/createFolder",authMiddleware,createFolder);


module.exports = router;