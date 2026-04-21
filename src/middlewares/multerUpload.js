const multer = require("multer");
const path = require("path");

// File filter to allow only audio files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /audio\/(mpeg|wav|ogg|flac|aac)/;
  if (allowedTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files are allowed"), false);
  }
};

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    // if (fileFilter(req, file, cb) === false) {
    //   return cb(new Error("Only audio files are allowed"), false);
    // }
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

exports.upload = multer({ storage });
