// server/middlewares/verifyStaffToken.js

import jwt from "jsonwebtoken";
import Teacher from "../models/TeacherInfo.js"; // ✅ Ensure path and filename are correct

const verifyStaffToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];;
    console.log('Authorization Header:', token);
    

    if (!token) {
      return res.status(403).json({ success: false, message: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const staff = await Teacher.findById(decoded.id);

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff member not found" });
    }

    // ✅ Allow access if role is teacher, hod, or librarian
    if (!["teacher", "hod", "librarian"].includes(staff.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    req.user = staff;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default verifyStaffToken;
