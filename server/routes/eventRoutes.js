// server/routes/eventRoutes.js

import express from 'express';
import {
  createEvent,
  getAllEvents,
  deleteEvent,
  participateInEvent,
  deleteParticipant,
  updateEvent, // ✅ added updateEvent
} from '../controllers/eventController.js';

import verifyStudentToken from '../middlewares/verifyStudentToken.js';
import verifyTeacherOrHODToken from '../middlewares/verifyTeacherOrHODToken.js'; // ✅ imported reusable middleware

const router = express.Router();

// Routes
router.post('/create', verifyTeacherOrHODToken, createEvent);
router.get('/allevents', getAllEvents);
router.post('/events/:id/participate', verifyStudentToken, participateInEvent);
router.delete('/delete/:id', verifyTeacherOrHODToken, deleteEvent);
router.delete('/events/:eventId/participants/:participantId', verifyTeacherOrHODToken, deleteParticipant);
router.put('/update/:id', verifyTeacherOrHODToken, updateEvent); // ✅ added route for updating events

export default router;
