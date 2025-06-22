// controllers/studentTeachercontroller.js

import StudentInfo from "../models/StudentInfo.js";
import TeacherInfo from "../models/TeacherInfo.js";
import mongoose from "mongoose";

// ✅ Allowed fields check
const validateUpdateFields = (type, updates) => {
  const allowedFieldsForStudent = [
    "name",
    "email",
    "phone",
    "fatherName",
    "gender",
    "address",
    "aadhaarNumber",
    "class",
    "yearOfAdmission",
    "username",
    "profileImage",
  ];
  const allowedFieldsForTeacher = [
    "name",
    "email",
    "phone",
    "teacherId",
    "gender",
    "aadhaar",
    "department",
    "subject",
    "username",
    "profileImage",
  ];

  const allowedFields =
    type === "student" ? allowedFieldsForStudent : allowedFieldsForTeacher;

  return Object.keys(updates).reduce((acc, key) => {
    if (allowedFields.includes(key)) {
      acc[key] = updates[key];
    }
    return acc;
  }, {});
};

// ✅ Update user details (HOD only)
export const updateUser = async (req, res) => {
  try {
    if (req.hod?.role !== "hod") {
      return res
        .status(403)
        .json({ success: false, message: "Only HODs can update users" });
    }

    const { type, id } = req.params;
    if (!["student", "teacher", "hod", "librarian"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user type" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    // ✅ HOD can only update own data under 'hod'
    if (type === "hod" && id !== req.hod._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "HODs can only update their own profile",
      });
    }

    const updates = validateUpdateFields(type, req.body);

    // ✅ Add image path if file is uploaded
    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      console.log("🖼 Image Path:", imagePath);
      updates.profileImage = imagePath;

      // 👇 Yeh line yahan daalo
      console.log("✅ Final updates:", updates);
    }

    const Model = type === "student" ? StudentInfo : TeacherInfo;

    const user = await Model.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: `${type} not found` });
    }

    console.log(`HOD updated ${type} with ID: ${id}`);

    res.status(200).json({
      success: true,
      message: `${type} updated successfully`,
      updatedUser: user,
    });
  } catch (err) {
    console.error("Error in updateUser:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete user (HOD only)
export const deleteUser = async (req, res) => {
  try {
    if (req.hod?.role !== "hod") {
      return res
        .status(403)
        .json({ success: false, message: "Only HODs can delete users" });
    }

    const { type, id } = req.params;
    if (!["student", "teacher", "hod", "librarian"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user type" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    const Model = type === "student" ? StudentInfo : TeacherInfo;
    const user = await Model.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: `${type} not found` });
    }

    console.log(`HOD deleted ${type} with ID: ${id}`);

    res
      .status(200)
      .json({ success: true, message: `${type} removed successfully` });
  } catch (err) {
    console.error("Error in deleteUser:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
