const User = require("../models/People");
const path = require('path');
const fs = require('fs');

async function uploadAvatar(req,res,next){
   
    try {
        console.log("Home controller: ",req.user);
        const user = await User.findById(req.user._id); // Find the user by ID
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Save the uploaded avatar file path to the user record
        const avatarPath = req.files.map(file => file.path); // The uploaded file path
        user.avatar = avatarPath; // Save the avatar path in the user model

        await user.save(); // Save the updated user document

        res.status(200).json({
            message: 'Avatar uploaded successfully!',
            avatarUrl: avatarPath, // Return the avatar URL to the user
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload avatar: ' + error.message });
    }

}
async function uploadNotes (req, res, next){
    try {
        console.log("User:", req.user);
        const user = await User.findById(req.user._id); // Find the user by ID
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Save the uploaded note file paths to the user record
        const notePaths = req.files.map((file) => file.path); // Array of uploaded file paths
    
        // Add the note paths to the user's notes array (assuming the User model has a `notes` field)
        if (!user.notes) {
          user.notes = []; // Initialize the notes array if it doesn't exist
        }
        user.notes.push(...notePaths); // Add the new note paths to the array
    
        await user.save(); // Save the updated user document
    
        res.status(200).json({
            message: "Notes uploaded successfully!",
            noteUrls: notePaths, // Return the note URLs to the user
          });
    } catch (error) {
        res.status(500).json({ error: "Failed to upload notes: " + error.message });
      }
}

async function uploadPdf (req, res, next){
    try {
        console.log("User:", req.user);
        const user = await User.findById(req.user._id); // Find the user by ID
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Save the uploaded note file paths to the user record
        const pdfPaths = req.files.map((file) => file.path); // Array of uploaded file paths
    
        if (!user.pdf) {
          user.pdf = []; // Initialize the notes array if it doesn't exist
        }
        user.pdf.push(...pdfPaths); // Add the new note paths to the array
    
        await user.save(); // Save the updated user document
    
        res.status(200).json({
            message: "PDF uploaded successfully!",
            pdfUrls: pdfPaths, // Return the pdf URLs to the user
          });
    } catch (error) {
        res.status(500).json({ error: "Failed to upload PDF: " + error.message });
      }
}

async function createFolder(req, res) {
    try {
      const { folderName } = req.body;
  
      // Validate folder name
      if (!folderName) {
        return res.status(400).json({ error: 'Folder name is required' });
      }
  
      // Define the folder path
      const folderPath = path.join(__dirname, '..', 'public', folderName);
  
      // Create the folder if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true }); // Create folder recursively
        return res.status(200).json({ message: `Folder '${folderName}' created successfully` });
      } else {
        return res.status(200).json({ message: `Folder '${folderName}' already exists` });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to create folder: ' + error.message });
    }
  }
module.exports ={
    uploadAvatar,
    uploadNotes,
    uploadPdf,
    createFolder
}