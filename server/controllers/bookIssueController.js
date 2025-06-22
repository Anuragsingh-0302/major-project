// controllers/bookIssueController.js

import IssuedBook from "../models/IssuedBookInfo.js";
import Student from "../models/StudentInfo.js";
import Book from "../models/BookInfo.js";
import moment from "moment"; // Import moment for date validation

// Issue a new book
export const issueBook = async (req, res) => {
  try {
    console.log("ISSUE REQ BODY:", req.body);
    const { enrollment, bookId, submissionDate } = req.body;

    // Validate submissionDate
    if (
      !submissionDate ||
      !moment(submissionDate, moment.ISO_8601, true).isValid()
    ) {
      return res.status(400).json({
        message: "Invalid submission date format. Please use a valid date.",
      });
    }

    // Optional: Check if the submission date is in the past
    if (moment(submissionDate).isBefore(moment())) {
      return res
        .status(400)
        .json({ message: "Submission date cannot be in the past." });
    }

    const student = await Student.findOne({ enrollment });
    const book = await Book.findOne({ bookId }); // ✅ FIXED

    if (!student || !book) {
      return res.status(404).json({ message: "Student or Book not found" });
    }

    // Check for duplicate issuance
    const existing = await IssuedBook.findOne({
      student: student._id,
      book: book._id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "This book is already assigned to the student." });
    }

    const newIssue = new IssuedBook({
      student: student._id,
      book: book._id,
      className: student.class,
      submissionDate,
    });

    await newIssue.save();
    res.status(201).json({ success: true, issuedBook: newIssue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to issue book" });
  }
};

// Get all issued books
export const getIssuedBooks = async (req, res) => {
  try {
    const issuedBooks = await IssuedBook.find()
      .populate("student", "name enrollment")
      .populate("book", "bookName bookId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, issuedBooks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch issued books" });
  }
};

// Extend submission date or mark as returned
export const extendSubmissionDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, isReturned } = req.body;

    const updateFields = {};

    if (newDate) updateFields.submissionDate = newDate;
    if (typeof isReturned !== "undefined") updateFields.isReturned = isReturned;

    const updated = await IssuedBook.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Issued book not found" });

    res.status(200).json({ success: true, updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update issued book" });
  }
};

// Delete issued book record
export const deleteIssuedBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await IssuedBook.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });

    res.status(200).json({ success: true, message: "Issued book deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete issued book" });
  }
};
