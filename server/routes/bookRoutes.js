// routes/bookRoutes.js

import express from 'express';
import { addBook, getBooks, deleteBook , getBookById , updateBook } from '../controllers/bookController.js';
import verifyLibrarianToken from '../middlewares/verifyLibrarianToken.js';
import uploadBooks from '../middlewares/uploadMiddlewareBooks.js';

const router = express.Router();

// Add a new book (with image) — Only librarian
router.post('/add-book', verifyLibrarianToken, uploadBooks.single('bookPhoto'), addBook);

// Get all books — public route (or restrict if needed)
router.get('/all-book', getBooks);

// Delete a book by ID — Only librarian
router.delete('/delete-book/:id', verifyLibrarianToken, deleteBook);

// Get a book by ID — public route in future we will add this feature
router.get('/get-book/:id', getBookById);

// Update a book by ID — Only librarian
router.patch('/update-book/:id', verifyLibrarianToken, uploadBooks.single('bookPhoto'), updateBook);

export default router;
