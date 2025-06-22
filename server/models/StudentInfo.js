// models/StudentInfo.js

import mongoose from "mongoose";

const studentInfoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    enrollment: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    fatherName: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    address: { type: String, required: true },
    aadhaarNumber: { type: String, required: true },
    class: { type: String, enum: ["MCA", "BCA"], required: true },
    yearOfAdmission: { type: Number, required: true },
    verified: { type: Boolean, default: false },
    role: {
      type: String,
      required: true,
      default: "student",
      immutable: true, // Prevent changes once set
    },
    createdBy: { type: String, enum: ["teacher", "hod"], required: true },

    username: { type: String, unique: true, sparse: true },
    password: { type: String },

    profileImage: { type: String }, // New field for profile image URL or path

    // 🆕 Add these fields for password reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },


  },
  { timestamps: true }
);

export default mongoose.model("StudentInfo", studentInfoSchema);
