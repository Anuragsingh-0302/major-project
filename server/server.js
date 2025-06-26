// server/server.js

import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import http from "http";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { deleteOldMediaFiles } from "./utils/cleanupOldChatMedia.js";
import { initIO } from "./socket.js"; // ✅

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.CLIENT_PORT || 3000;
const server = http.createServer(app);

// ✅ Initialize socket.io
const io = initIO(server);

connectDB();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// ✅ Serve uploads as downloadable
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res, filePath) => {
      if (
        filePath.endsWith(".pdf") ||
        filePath.endsWith(".png") ||
        filePath.endsWith(".jpg") ||
        filePath.endsWith(".jpeg") ||
        filePath.endsWith(".gif")
      ) {
        res.setHeader("Content-Disposition", "attachment");
      }
    },
  })
);


app.get("/", (req, res) => {
  res.send("API is running on port " + PORT);
});

// ✅ Routes
import studentRoutes from "./routes/StudentInfo.js";
import authRoutes from "./routes/studentAuth.js";
import verifyStudentRoutes from "./routes/verifyStudent.js";
import teacherRoutes from "./routes/teacherInfo.js";
import verifyTeacherRoutes from "./routes/verifyTeacher.js";
import roleRoutes from "./routes/roleRoutes.js";
import hodRoutes from "./routes/studentTeacherRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import timetableRoutes from "./routes/timeTableRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import issuedBookRoutes from "./routes/bookIssuedRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";


app.use("/api/student", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/verify-student", verifyStudentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/verify-teacher", verifyTeacherRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/hod", hodRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/library-book", bookRoutes);
app.use("/api/library-issued", issuedBookRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);



// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// ✅ Cleanup Task
cron.schedule("0 2 * * *", async () => {
  console.log("Running scheduled task to delete old media files...");
  await deleteOldMediaFiles();
});

// ✅ Socket Logic
io.on("connection", (socket) => {
  console.log("⚡ New socket connected:", socket.id);

  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log(`📥 Joined room: ${conversationId}`);
  });

  socket.on("sendMessage", (messageData) => {
    const { conversationId } = messageData;
    console.log("📤 Emitting to room:", conversationId);
    socket.to(conversationId).emit("receiveMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
