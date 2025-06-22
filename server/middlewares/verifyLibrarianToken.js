//middlewares/verifyLibrarianToken.js
import jwt from 'jsonwebtoken';
import Librarian from '../models/TeacherInfo.js'; // Adjust path as needed

const verifyLibrarianToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.librarian = await Librarian.findById(decoded.id); // Fetch user from database
        if (!req.librarian || req.librarian.role !== 'librarian') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export default verifyLibrarianToken;