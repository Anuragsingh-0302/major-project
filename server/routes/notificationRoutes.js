// server/routes/notificationRoutes.js

import express from "express";
import {
  createNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
} from "../controllers/notificationController.js";

import { verifyUserToken } from "../middlewares/verifyUserToken.js";

const router = express.Router();

// All users can read
router.get("/", getAllNotifications);

// Only authorized users (teachers, hods, librarians) can create/update/delete
router.post("/create", verifyUserToken, createNotification);
router.patch("/update/:id", verifyUserToken, updateNotification);
router.delete("/delete/:id", verifyUserToken, deleteNotification);

export default router;
