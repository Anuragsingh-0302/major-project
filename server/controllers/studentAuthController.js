// controllers/authController.js

import StudentInfo from "../models/StudentInfo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (student) => {
  return jwt.sign(
    {
      id: student._id,
      enrollment: student.enrollment,
      username: student.username,
      role: student.role || "student",
      class: student.class, // ✅ yeh honi chahiye
      yearOfAdmission: student.yearOfAdmission,
      createdBy: student.createdBy,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Student signup check
export const studentSignup = async (req, res) => {
  try {
    const { enrollment, username, password } = req.body;

    // Replace backslashes with forward slashes
    const profileImage = req.file
      ? "/" + req.file.path.replace(/\\/g, "/")
      : null;

    const existing = await StudentInfo.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const student = await StudentInfo.findOne({ enrollment });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.verified) {
      return res.status(403).json({ message: "Student not verified yet" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    student.username = username;
    student.password = hashedPassword;
    if (profileImage) {
      student.profileImage = profileImage;
    }
    await student.save();
    res
      .status(200)
      .json({ success: true, message: "Signup successful", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// student login check

export const studentLogin = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    const student = await StudentInfo.findOne({
      $or: [{ enrollment: loginId }, { email: loginId }, { username: loginId }],
    });

    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!student.verified)
      return res.status(403).json({ message: "Student not verified yet" });

    if (!student.password) {
      return res
        .status(400)
        .json({ message: "Password not set. Please complete signup first." });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(student);

    // ✅ Send token as httpOnly cookie
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "Lax", // Or 'None' with secure if cross-origin
        secure: false, // Set to true in production with HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Login successful",
        token,
        student: {
          id: student._id,
          enrollment: student.enrollment,
          name: student.name,
          username: student.username,
          role: student.role || "student",
          email: student.email,
          phone: student.phone,
          profileImage: student.profileImage,
          createdBy: student.createdBy,
          address: student.address,
          aadhaarNumber: student.aadhaarNumber,
          class: student.class,
          yearOfAdmission: student.yearOfAdmission,
          verified: student.verified,
          gender: student.gender,
          token: token, // Include token in response
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// 📩 Forgot Password - send reset link
export const studentForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const student = await StudentInfo.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const resetToken = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    student.resetPasswordToken = resetToken;
    student.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await student.save();

    const resetLink = `http://localhost:5173/reset-password/student/${resetToken}`;
    const html = `
      <h3>DeptHub Password Reset</h3>
      <p>Hello ${student.name},</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetLink}" style="padding:10px 20px; background:#007bff; color:#fff; text-decoration:none;">Reset Password</a>
      <p>This link is valid for 15 minutes only.</p>
    `;

    await sendEmail(student.email, "Reset your DeptHub Password", html);
    res.json({ success: true, message: "Reset link sent to your email" });
  } catch (err) {
    console.error("studentForgotPassword:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// 🔑 Reset Password
export const studentResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await StudentInfo.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    student.password = hashedPassword;
    student.resetPasswordToken = undefined;
    student.resetPasswordExpires = undefined;

    await student.save();
    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("studentResetPassword:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};