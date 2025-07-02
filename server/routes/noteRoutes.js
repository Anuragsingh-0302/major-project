// server/routes/noteRoutes.js

import express from "express";
import {
  uploadNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  upload,
} from "../controllers/noteController.js";
import verifyTeacherOrHODToken from "../middlewares/verifyTeacherOrHODToken.js";
// import { verifyUserToken } from "../middlewares/verifyUserToken.js"; // ✅ added for students

const router = express.Router();

// 🔼 teacher/hod only
router.post("/upload-note", verifyTeacherOrHODToken, upload.single("file"), uploadNote);
router.put("/:id", verifyTeacherOrHODToken, upload.single("file"), updateNote);
router.delete("/:id", verifyTeacherOrHODToken, deleteNote);

// 🔽 all roles can view (verifyUserToken allows student also)
router.get("/", getNotes);
router.get("/:id",  getNoteById);

export default router;
