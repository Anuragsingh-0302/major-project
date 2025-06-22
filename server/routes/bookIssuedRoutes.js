// routes/bookIssuedRoutes.js

import express from 'express';
import {
  issueBook,
  getIssuedBooks,
  extendSubmissionDate,
  deleteIssuedBook
} from '../controllers/bookIssueController.js';

import verifyLibrarianToken from '../middlewares/verifyLibrarianToken.js';

const router = express.Router();

// Issue a book to a student
router.post('/create', verifyLibrarianToken, issueBook);

// Get all issued books
router.get('/display', getIssuedBooks);

// Extend submission date
router.put('/extend/:id', verifyLibrarianToken, extendSubmissionDate);

// Delete issued book record
router.delete('/delete/:id', verifyLibrarianToken, deleteIssuedBook);

export default router;
