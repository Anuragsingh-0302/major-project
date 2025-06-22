import Book from "../models/BookInfo.js";
import fs from "fs";
import path from "path";

// Add a new book (only librarian)
export const addBook = async (req, res) => {
  try {
    const { bookId, bookName, author, publisher, publicationYear } = req.body;
    const bookPhoto = req.file ? "/" + req.file.path.replace(/\\/g, "/") : null;

    // Duplicate check
    const exists = await Book.findOne({ bookId });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Book ID already exists" });
    }

    const newBook = new Book({ bookId, bookName, author, publisher , publicationYear, bookPhoto });
    await newBook.save();

    res.status(201).json({ success: true, book: newBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add book" });
  }
};

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch books" });
  }
};

// Delete a book (optional future)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Delete image file
    if (book.bookPhoto) {
      try {
        const imagePath = path.resolve(book.bookPhoto);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error("Error deleting file:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to delete book image" });
      }
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Book deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};


// book updation (optional future)
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ success: true, book: updatedBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};


// Get book by ID (future feature)
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ success: true, book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch book" });
  }
}