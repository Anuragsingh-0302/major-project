// middlewares/verifyTeacherToken.js

import jwt from 'jsonwebtoken';
import Teacher from '../models/TeacherInfo.js'; // Adjust path as needed

const verifyTeacherToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    // Fetch teacher (or HOD) info from DB by id in token
    const teacher = await Teacher.findById(decoded.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    // Attach teacher info to request for downstream usage
    req.teacher = {
      _id: teacher._id,
      name: teacher.name,
      role: teacher.role, // either 'teacher' or 'hod'
    };

    // Allow only if role is teacher or hod
    if (req.teacher.role !== 'teacher' && req.teacher.role !== 'hod') {
      return res.status(403).json({ message: 'Not authorized. Must be a teacher or HOD.' });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

export default verifyTeacherToken;

