const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Define storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Save files to 'public/uploads'
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    const uniqueName = `${uuidv4()}${ext}`; // Generate unique filename
    cb(null, uniqueName);
  },
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo", // Common video formats
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
  fileFilter: fileFilter,
});
const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Smaller limit (10MB)
  fileFilter: (req, file, cb) => {
    // Only allow images for detection
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for detection"), false);
    }
  },
});
module.exports = { upload, uploadMemory };
