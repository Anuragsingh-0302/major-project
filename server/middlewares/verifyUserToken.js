// middleware/verifyUserToken.js
import jwt from "jsonwebtoken";
import StudentInfo from "../models/StudentInfo.js";
import TeacherInfo from "../models/TeacherInfo.js";

export const verifyUserToken = async (req, res, next) => {
  const token = req.cookies?.access_token || req.headers.authorization?.split(" ")[1]; // ✅ Get token from cookies

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ Decoded user:", decoded);
    let user;
    if (decoded.role === "student") {
      user = await StudentInfo.findById(decoded.id);
    } else if (["teacher", "hod", "librarian"].includes(decoded.role)) {
      user = await TeacherInfo.findById(decoded.id);
    } else {
      return res.status(403).json({ message: "Invalid role" });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = {
      id: user._id,
      role:
        user.role === "student"
          ? "StudentInfo"
          : "TeacherInfo", // ✅ All other roles are TeacherInfo
      actualRole: user.role, // "teacher" | "hod" | "librarian" | "student"
      name: user.name || user.fullName,
      email: user.email,
    };

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    console.error("Token verify error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
