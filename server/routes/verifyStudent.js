// routes/verifyStudent.js
import express from "express";
import verifyToken from "../middlewares/verifyStudentToken.js";
import StudentInfo from "../models/StudentInfo.js";
import bcrypt from "bcrypt";

const router = express.Router();

// GET - Fetch Student Profile
// This endpoint retrieves the profile of the logged-in student
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const student = await StudentInfo.findById(req.student.id).select(
      "-password"
    );
    res.json({ success: true, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// PUT - Update Student Profile (only phone & password)
// Only phone and password can be updated by the student
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { phone, password } = req.body;

    const student = await StudentInfo.findById(req.student.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (phone) student.phone = phone;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      student.password = hashedPassword;
    }

    await student.save();

    res.json({
      message: "Profile updated successfully",
      student: {
        id: student._id,
        enrollment: student.enrollment,
        username: student.username,
        phone: student.phone,
        role: student.createdBy,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
