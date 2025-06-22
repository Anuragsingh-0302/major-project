// controllers/teacherAuthController.js

import Teacher from "../models/TeacherInfo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (teacher) => {
  return jwt.sign(
    {
      id: teacher._id,
      teacherId: teacher.teacherId,
      username: teacher.username,
      role: teacher.role || "teacher",
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// teacher signup check
export const teacherSignup = async (req, res) => {
  try {
    console.log("Received signup request:", req.body);

    const { teacherId, username, password } = req.body;
    const profileImage = req.file
      ? "/" + req.file.path.replace(/\\/g, "/")
      : null;

    const teacher = await Teacher.findOne({ teacherId });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (teacher.username) {
      return res.status(400).json({ message: "Signup already completed" });
    }

    const existing = await Teacher.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    teacher.username = username;
    teacher.password = hashedPassword;
    if (profileImage) {
      teacher.profileImage = profileImage; // Save image path
    }

    await teacher.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Signup successful",
        teacherId: teacher.teacherId,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// teacher login check

export const teacherLogin = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    const teacher = await Teacher.findOne({
      $or: [
        { username: loginId },
        { email: loginId },
        { phone: loginId },
        { teacherId: loginId },
      ],
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (!teacher.password) {
      return res.status(403).json({ message: "Signup not completed yet" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(teacher);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "Lax", // Or "None" + secure for cross-site
        secure: false, // Set to true in production (HTTPS)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Login successful",
        token,
        teacher: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          phone: teacher.phone,
          teacherId: teacher.teacherId,
          username: teacher.username,
          department: teacher.department,
          subject: teacher.subject,
          role: teacher.role || "teacher",
          createdBy: teacher.createdBy,
          profileImage: teacher.profileImage,
          verified: teacher.verified,
          aadhaar: teacher.aadhaar,
          gender: teacher.gender,
        },
      });
    console.log(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔐 Forgot Password - Teacher
export const teacherForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const resetToken = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    teacher.resetPasswordToken = resetToken;
    teacher.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await teacher.save();

    const resetLink = `http://localhost:5173/reset-password/teacher/${resetToken}`;
    const html = `
      <h3>DeptHub Password Reset</h3>
      <p>Hello ${teacher.name},</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetLink}" style="padding:10px 20px; background:#007bff; color:#fff; text-decoration:none;">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail(teacher.email, "Reset your DeptHub Password", html);
    res.json({ success: true, message: "Reset link sent to your email" });
  } catch (err) {
    console.error("teacherForgotPassword:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// 🔑 Reset Password - Teacher
export const teacherResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const teacher = await Teacher.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!teacher) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    teacher.password = hashedPassword;
    teacher.resetPasswordToken = undefined;
    teacher.resetPasswordExpires = undefined;

    await teacher.save();
    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("teacherResetPassword:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
