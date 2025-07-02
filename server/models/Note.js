// server/models/Note.js

import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  file: {
    type: String, // relative path to uploaded file
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeacherInfo",
    required: true,
  },
  role: {
    type: String,
    enum: ["teacher", "hod"],
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Note", noteSchema);
