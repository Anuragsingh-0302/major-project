// routes/roleRoutes.js

// routes/roleRoutes.js

import express from "express";
import {
  getAllTeachers,
  getAllLibrarians,
  getAllHODs,
  
  getFilteredStudents, // ✅ new controller
  getAllTeachersLibrariansDetails,
  getMyMates,
} from "../controllers/userRoleController.js";

import verifyHODToken from "../middlewares/verifyHODToken.js";
import verifyStudentToken from "../middlewares/verifyStudentToken.js";
import verifyStaffToken from "../middlewares/verifyStaffToken.js"; // ✅ new middleware

const router = express.Router();

// Routes for HOD to get all users of different roles
router.get("/teachers", verifyHODToken, getAllTeachers);
router.get("/librarians", verifyHODToken, getAllLibrarians);
router.get("/hods", getAllHODs);

// ✅ NEW: Filter students by class + year
router.get("/students", verifyStaffToken,  getFilteredStudents);

// ❌ OLD: This route is now replaced by the above one
// router.get('/students/:class', verifyHODToken, getStudentsByClass);

router.get("/teachers-librarians", getAllTeachersLibrariansDetails);
router.get("/mymates", verifyStudentToken, getMyMates);

export default router;
