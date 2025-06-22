// middlewares/uploadMiddleware.js

import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists or create it
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});

// Init upload
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit size to 10MB
  fileFilter: (req, file, cb) => {
    // Accept only PDFs and images (jpg, jpeg, png)
    const filetypes = /pdf|jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed!'));
    }
  },
});

export default upload;
