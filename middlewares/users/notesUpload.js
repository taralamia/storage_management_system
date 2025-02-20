const uploader = require("../../utilities/singleUploader");

function notesUpload(req, res, next) {

  const folderName = req.body.folderName || "notes"; 
  // Configure uploader for notes
  const uploadNotes = uploader(
    "folderName", // Folder for storing notes
    ["application/pdf", "text/plain", "application/msword"], // Allowed file types (PDF, TXT, DOC)
    10000000, // 10MB file size limit
    "Only .pdf, .txt, or .doc files are allowed!" // Error message for invalid file types
  );

  // Handle multiple file uploads (up to 5 files)
  uploadNotes.array("notes", 5)(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload notes",
        error: err.message,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded. Please select at least one note file.",
      });
    }

    console.log("Files received:", req.files);
    next(); // Proceed to next middleware
  });
}

module.exports = notesUpload;