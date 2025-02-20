const uploader = require("../../utilities/singleUploader");

function avatarUpload(req, res, next) {

  const folderName = req.body.folderName || "uploads"; 

  const uploadAvatar = uploader(
    folderName,
    ["image/jpeg", "image/jpg", "image/png"],
    1000000, // 1MB file size limit
    "Only .jpg, jpeg or .png format allowed!"
  );

  uploadAvatar.array("avatar",5)(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload avatar",
        error: err.message,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an image file.",
      });
    }

    console.log("File received:", req.files);
    next(); // Proceed to next middleware
  });
}

module.exports = avatarUpload;
