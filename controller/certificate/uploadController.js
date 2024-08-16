// controllers/fileController.js
const path = require('path');
const fs = require('fs');

// Multer setup for memory storage
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  rename: function (fieldname, filename) {
    return  filename + Date.now();
},
limits: {
    fieldNameSize: 200,
    files: 5,
    fields: 5
}
});

// Middleware to handle file uploads
const uploadFile = upload.single('file');

const handleFileUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Process the file in memory
  const fileBuffer = req.file.buffer;
  const tempFilePath = path.join(__dirname, '../uploads', `${Date.now()}-${req.file.originalname}`);

  // Save the file temporarily
  fs.writeFile(tempFilePath, fileBuffer, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error saving file' });
    }

    // Send the URL of the uploaded image
    const fileUrl = `/uploads/${path.basename(tempFilePath)}`;
    res.json({ url: fileUrl });

    // Optionally delete the file after sending the response
    fs.unlink(tempFilePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting temp file:', unlinkErr);
      }
    });
  });
};

module.exports = {
  uploadFile,
  handleFileUpload,
};
