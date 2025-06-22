// routes/studentTeacherRoutes.js
import express from 'express';
import {
  updateUser,
  deleteUser
} from '../controllers/studentTeachercontroller.js';
import verifyHODToken from '../middlewares/verifyHODToken.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Only accessible to HODs 
router.put('/:type/:id', verifyHODToken,upload.single('profileImage'), updateUser); // type = student/teacher
router.delete('/:type/:id', verifyHODToken, deleteUser);

export default router;
