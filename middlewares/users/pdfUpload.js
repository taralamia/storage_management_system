const uploader = require("../../utilities/singleUploader");

function pdfUpload(req, res, next) {

  const folderName = req.body.folderName || "pdf"; 
  // Configure uploader for notes
  const uploadPdf = uploader(
    folderName, // Folder for storing notes
    ["application/pdf"], // Allowed file types (PDF)
    10000000, // 10MB file size limit
    "Only .pdf files are allowed!" // Error message for invalid file types
  );

  // Handle multiple file uploads (up to 5 files)
  uploadPdf.array("pdf", 5)(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload pdf",
        error: err.message,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded. Please select at least one pdf file.",
      });
    }

    console.log("Files received:", req.files);
    next(); // Proceed to next middleware
  });
}

module.exports = pdfUpload;