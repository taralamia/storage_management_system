const mongoose = require('mongoose');
const People = require("./People"); 

const fileUploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: People, // Reference to the People model
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  image:{
    data:Buffer,
    contentType: String
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const FileUpload = mongoose.model('FileUpload', fileUploadSchema);
module.exports = FileUpload;
