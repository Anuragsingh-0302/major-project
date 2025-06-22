// routes/attendanceRoutes.js

import express from 'express';
import {
  takeAttendance,
  displayAttendance,
  exportAttendance,
} from '../controllers/attendanceController.js';
import verifyTeacherOrHODToken from '../middlewares/verifyTeacherOrHODToken.js';

const router = express.Router();

// ✅ Take Attendance - Only Teacher or HOD
router.post('/take', verifyTeacherOrHODToken, takeAttendance);

// ✅ Display Attendance - Only Teacher or HOD
router.get('/display', verifyTeacherOrHODToken, displayAttendance);

// ℹ️ Optional: Add update/delete routes in future

// ✅ Export Attendance - Only Teacher or HOD
router.get('/export', verifyTeacherOrHODToken, exportAttendance);

export default router;
