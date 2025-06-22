// routes/studentInfo.js
import express from "express";
import {
  registerByTeacher,
  registerByHOD,
  getPendingStudents,
  verifyStudent,
  getUnverifiedStudents,
  updateStudent,
  updateStudentProfile,
  deleteStudent,
} from "../controllers/studentController.js";
import verifyHODToken from "../middlewares/verifyHODToken.js";
import verifyTeacherToken from "../middlewares/verifyTeacherToken.js";
import  upload  from "../middlewares/uploadMiddleware.js";
import { getFilteredStudents } from '../controllers/studentController.js';
import { verifyUserToken } from '../middlewares/verifyUserToken.js'; 

const router = express.Router();

router.post("/registerByTeacher", verifyTeacherToken, registerByTeacher);
router.post("/registerByHOD", verifyHODToken, registerByHOD);

router.get("/pending", verifyHODToken, getPendingStudents);
router.patch("/verify/:id", verifyHODToken, verifyStudent);

router.get("/unverified", verifyHODToken, getUnverifiedStudents);
router.patch("/update/:id", verifyHODToken, updateStudent);

router.patch("/updateStudentProfile/:id", verifyHODToken, upload.single("profileImage"), updateStudentProfile);
router.delete("/delete/:id", verifyHODToken, deleteStudent);

router.get('/filter', verifyUserToken, getFilteredStudents);

export default router;
