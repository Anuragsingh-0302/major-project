// controllers/noteController.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import Note from "../models/Note.js";
import Teacher from "../models/TeacherInfo.js";

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "notes");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_EXT = [
  ".pdf", ".doc", ".docx", ".md", ".markdown", ".html", ".htm",
  ".txt", ".odt", ".xls", ".xlsx", ".ppt", ".pptx", ".json", ".xml",
];

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const fileFilter = (_, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, ALLOWED_EXT.includes(ext));
};

export const upload = multer({ storage, fileFilter });

// ✅ Upload Note
export const uploadNote = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher || !["teacher", "hod"].includes(teacher.role)) {
      return res.status(403).json({ success: false, msg: "Forbidden" });
    }

    const { title, subject, description } = req.body;

    if (!title?.trim() || !subject?.trim()) {
      return res.status(400).json({ success: false, msg: "Title and subject are required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, msg: "No file uploaded" });
    }

    const note = await Note.create({
      title: title.trim(),
      subject: subject.trim(),
      description: description?.trim() || "",
      file: `/uploads/notes/${req.file.filename}`,
      uploadedBy: teacher._id,
      role: teacher.role,
    });

    res.status(201).json({ success: true, note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ✅ Get All Notes (public)
export const getNotes = async (req, res) => {
  try {
    const filter = req.query.subject
      ? { subject: { $regex: req.query.subject.trim(), $options: "i" } }
      : {};

    const notes = await Note.find(filter).sort({ uploadedAt: -1 });
    res.json({ success: true, notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ✅ Get Note by ID (public)
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, msg: "Note not found" });
    res.json({ success: true, note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ✅ Update Note (only uploader)
export const updateNote = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) return res.status(403).json({ success: false, msg: "Forbidden" });

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, msg: "Note not found" });

    if (note.uploadedBy.toString() !== teacher._id.toString())
      return res.status(403).json({ success: false, msg: "Forbidden" });

    const { title, subject, description } = req.body;
    if (title) note.title = title.trim();
    if (subject) note.subject = subject.trim();
    if (description) note.description = description.trim();

    if (req.file) {
      const oldPath = path.join(__dirname, "..", note.file);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      note.file = `/uploads/notes/${req.file.filename}`;
    }

    await note.save();
    res.json({ success: true, note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ✅ Delete Note (only uploader)
export const deleteNote = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) return res.status(403).json({ success: false, msg: "Forbidden" });

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, msg: "Note not found" });

    if (note.uploadedBy.toString() !== teacher._id.toString())
      return res.status(403).json({ success: false, msg: "Forbidden" });

    const filePath = path.join(__dirname, "..", note.file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await note.deleteOne();
    res.json({ success: true, msg: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
