const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create folders if they don't exist
const folders = [
  "uploads",
  "uploads/aadhaar",
  "uploads/pan",
];

folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "uploads";

    if (file.fieldname === "aadhaarFile") {
      uploadPath = "uploads/aadhaar";
    } else if (file.fieldname === "panFile") {
      uploadPath = "uploads/pan";
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".pdf",
    ".doc",
    ".docx",
    ".jpg",
    ".jpeg",
    ".png",
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC, DOCX, JPG, JPEG and PNG files are allowed."
      ),
      false
    );
  }
};

// Upload Middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
});

module.exports = upload;