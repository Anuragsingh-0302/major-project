// routes/verifyTeacher.js
import express from 'express';
import verifyTeacherToken from '../middlewares/verifyTeacherToken.js';
import verifyHODToken from '../middlewares/verifyHODToken.js';
import Teacher from '../models/TeacherInfo.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// GET - Fetch Teacher Profile
// This route fetches the teacher's profile using the token from the request

router.get('/profile', verifyTeacherToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id).select('-password');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    res.status(200).json({ success: true, teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching teacher profile' });
  }
});

// PUT - Update Teacher Profile (only phone & password)
// Only phone and password can be updated by the teacher
router.put('/profile', verifyTeacherToken, async (req, res) => {
  try {
    const { phone, password } = req.body;

    const updates = {};
    if (phone) updates.phone = phone;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.teacher.id,   // `req.teacher.id` from JWT token
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated', teacher: updatedTeacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});


router.put('/assign/:id', verifyHODToken, async (req, res) => {
  try {
    const { department, subject } = req.body;

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    // Add departments and subjects (push if not already there)
    teacher.department = [...new Set([...(teacher.department || []), ...(department || [])])];
    teacher.subject = [...new Set([...(teacher.subject || []), ...(subject || [])])];

    await teacher.save();
    res.status(200).json({ message: 'Departments and subjects assigned successfully', teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
