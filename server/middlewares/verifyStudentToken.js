// middlewares/verifyToken.js

import jwt from 'jsonwebtoken';

const verifyStudentToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
 
  console.log('Authorization Header:', authHeader); // Debugging line to check the header

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 👈 consistent with frontend/backend usage
    console.log(req.user);
    
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default verifyStudentToken;

