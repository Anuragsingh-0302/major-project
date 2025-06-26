// controllers/teacherController.js

import TeacherInfo from '../models/TeacherInfo.js';
import fs from 'fs';
import path from 'path';

export const registerTeacherByHOD = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      teacherId,
      gender,
      aadhaar,
      department,
      subject,
      role
    } = req.body;

    const existing = await TeacherInfo.findOne({ teacherId });
    if (existing) {
      return res.status(400).json({ message: 'Teacher with this ID already exists' });
    }

    const newTeacher = new TeacherInfo({
      name,
      email,
      phone,
      teacherId,
      gender,
      aadhaar,
      department,
      subject,
      role,
      createdBy: 'hod',
      verified: true
      // username and password will be added later by teacher
    });

    await newTeacher.save();
    res.status(201).json({ message: 'Teacher registered successfully', teacher: newTeacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTeacherById = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const updateData = req.body;

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    // Filter only changed fields
    const existing = await TeacherInfo.findById(teacherId);
    if (!existing) return res.status(404).json({ message: 'Teacher not found' });

    // Remove old image if new image uploaded
    if (req.file && existing.profileImage) {
      const oldPath = path.join('public', existing.profileImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Update only changed fields
    Object.keys(updateData).forEach((key) => {
      if (
        updateData[key] !== undefined &&
        updateData[key] !== existing[key]
      ) {
        existing[key] = updateData[key];
      }
    });

    await existing.save();
    res.json({ message: 'Profile updated successfully', teacher: existing });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTeacherById = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await TeacherInfo.findByIdAndDelete(teacherId);

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    // Delete profile image if exists
    if (teacher.profileImage) {
      const imgPath = path.join('public', teacher.profileImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    res.json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};