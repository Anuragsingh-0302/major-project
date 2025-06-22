// models/TeacherInfo.js

import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    teacherId: { type: String, required: true, unique: true }, // Assigned by HOD
    gender: { type: String, enum: ["male", "female"], required: true },
    aadhaar: { type: String, required: true, unique: true },
    department: [{ type: String, required: true }], // One or multiple
    subject: [{ type: String, required: true }], // One or multiple
    createdBy: { type: String, default: "hod" },
    verified: { type: Boolean, default: true },

    role: {
      type: String,
      enum: ["teacher", "hod", "librarian"],
      default: "teacher",
    },
    username: { type: String, unique: true, sparse: true }, // Optional, can be set later
    password: { type: String },

    profileImage: { type: String }, // URL or path to profile image

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("TeacherInfo", teacherSchema);
