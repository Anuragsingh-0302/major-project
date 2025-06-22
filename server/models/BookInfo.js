// models/BookInfo.js

import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  bookName: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  publisher: {
    type: String,
    default: "Not Available",
    trim: true
  },
  publicationYear: {
    type: Number,
    default: new Date().getFullYear()
  },
  bookPhoto: {
    type: String, // File path for uploaded image
    default: ""   // in case not uploaded
  }
}, { timestamps: true });

export default mongoose.model("Book", bookSchema);
