// routes/auth.js
import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { studentSignup , studentLogin , studentForgotPassword, studentResetPassword } from '../controllers/studentAuthController.js';


const router = express.Router();

// Routes for student authentication
// These routes are for student signup and login
router.post('/student-signup', upload.single('profileImage'), studentSignup);
router.post('/student-login', studentLogin);

// 🔐 Forgot Password route
router.post("/student-forgot-password", studentForgotPassword);

// 🔑 Reset Password route (token in URL)
router.post("/student-reset-password/:token", studentResetPassword);

export default router;
