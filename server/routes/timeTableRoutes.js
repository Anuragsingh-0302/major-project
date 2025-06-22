// routes/timeTableRoutes.js

import express from 'express';
import {
  uploadTimeTable,
  getTimeTables,
  deleteTimeTable,
} from '../controllers/timeTableController.js';
import upload from '../middlewares/uploadMiddleware.js';

import verifyHODToken from '../middlewares/verifyHODToken.js';

const router = express.Router();

// HOD uploads new timetable
router.post('/create', verifyHODToken,upload.single('file'), uploadTimeTable);

// Anyone can fetch timetables (students/teachers)
router.get('/display', getTimeTables);

// HOD can delete timetable
router.delete('/delete/:id', verifyHODToken, deleteTimeTable);

export default router;
