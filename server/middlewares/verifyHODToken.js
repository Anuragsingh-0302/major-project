// middlewares/verifyHODToken.js

import jwt from "jsonwebtoken";
import Teachers from "../models/TeacherInfo.js"; // Assuming you have a Teachers model

const verifyHODToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.hod = await Teachers.findById(decoded.id); // Fetch user from database
    console.log(`HOD ID: ${req.hod._id}`); // Log HOD ID for debugging
    if (!req.hod || req.hod.role !== "hod") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Invalid token." });
  }
};

export default verifyHODToken;
