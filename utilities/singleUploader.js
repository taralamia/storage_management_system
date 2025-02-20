const multer = require('multer');
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');

function uploader(
  subfolder_path, // Subfolder for file type (e.g., images, pdfs, notes)
  allowed_file_types,
  max_file_size,
  error_msg
) {
  // Base upload folder
  const UPLOADS_FOLDER = path.join(__dirname, "..", "public");

  // Define the storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Get the folder name from the request body
      let folderName = req.body.folderName;

      // Construct the full upload path
      //const uploadPath = path.join(UPLOADS_FOLDER, folderName, subfolder_path);

      if (!folderName) {
        folderName = subfolder_path; 
      }

      const uploadPath = path.join(UPLOADS_FOLDER, folderName);

      cb(null, uploadPath); // Set the destination folder
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();

      cb(null, fileName + fileExt);
    },
  });

  // Prepare the final multer upload object
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(error_msg));
      }
    },
  });

  return upload;
}

module.exports = uploader;