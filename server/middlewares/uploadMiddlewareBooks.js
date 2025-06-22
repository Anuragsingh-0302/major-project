// middlewares/uploadBooksMiddleware.js

import multer from "multer";
import path from "path";

// Set storage engine for books
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/books"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g. 16234234234.pdf
  },
});

// File filter for PDFs and images
const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and image files are allowed for books!"));
  }
};

// Multer config
const uploadBooks = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10 MB
  fileFilter,
});

export default uploadBooks;
