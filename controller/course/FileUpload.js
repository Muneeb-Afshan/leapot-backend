const multer = require('multer');

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Uploads will be stored in the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set unique file name
  },
});

// Create multer instance with configured options
const upload = multer({ storage: storage });

module.exports = upload;
