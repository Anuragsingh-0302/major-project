// routes/teacherInfo.js
import express from 'express';
import { registerTeacherByHOD , updateTeacherById , deleteTeacherById } from '../controllers/teacherController.js';
import { teacherSignup , teacherLogin , teacherForgotPassword, teacherResetPassword } from '../controllers/teacherAuthController.js';
import verifyHODToken from '../middlewares/verifyHODToken.js';
import upload from '../middlewares/uploadMiddleware.js'; // Import the upload middleware

const router = express.Router();

// Routes for teacher registration and authentication by HOD
router.post('/register-by-hod', verifyHODToken, registerTeacherByHOD);
router.patch('/update/:id', verifyHODToken, upload.single('profileImage'), updateTeacherById);
router.delete('/delete/:id', verifyHODToken, deleteTeacherById);


// Routes for teacher authentication
// These routes are for teacher signup and login
router.post('/signup', upload.single('profileImage'), teacherSignup);
router.post('/login', teacherLogin);

router.post('/forgot-password', teacherForgotPassword);
router.post('/reset-password/:token', teacherResetPassword);

export default router;
