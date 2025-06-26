// server/controllers/studentController.js

import StudentInfo from "../models/StudentInfo.js";

// Helper function for validating required fields
const validateStudentData = (data) => {
  const {
    name,
    enrollment,
    email,
    phone,
    fatherName,
    gender,
    address,
    aadhaarNumber,
    class: studentClass,
    yearOfAdmission,
  } = data;

  if (
    !name ||
    !enrollment ||
    !email ||
    !phone ||
    !fatherName ||
    !gender ||
    !address ||
    !aadhaarNumber ||
    !studentClass ||
    !yearOfAdmission
  ) {
    return false;
  }
  // Additional validations can be added here (e.g., email format, phone number format, class enum, etc.)
  return true;
};

// Register by Teacher (unverified by default)
export const registerByTeacher = async (req, res) => {
  try {
    // Validate student data
    if (!validateStudentData(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required student fields.",
      });
    }

    const data = { ...req.body, verified: false, createdBy: "teacher" };
    const newStudent = new StudentInfo(data);
    await newStudent.save();

    res.status(201).json({ success: true, student: newStudent });
  } catch (error) {
    console.error("Error in registerByTeacher:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the student.",
    });
  }
};

// Register by HOD (directly verified)
export const registerByHOD = async (req, res) => {
  try {
    // Validate student data
    if (!validateStudentData(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required student fields.",
      });
    }

    const data = { ...req.body, verified: true, createdBy: "hod" };
    const newStudent = new StudentInfo(data);
    await newStudent.save();

    res.status(201).json({ success: true, student: newStudent });
  } catch (error) {
    console.error("Error in registerByHOD:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the student.",
    });
  }
};

// Get pending students
export const getPendingStudents = async (req, res) => {
  try {
    const students = await StudentInfo.find({ verified: false });
    res.json({ success: true, students });
  } catch (error) {
    console.error("Error in getPendingStudents:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching pending students.",
    });
  }
};

// Verify a student
export const verifyStudent = async (req, res) => {
  try {
    const student = await StudentInfo.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.json({ success: true, student });
  } catch (error) {
    console.error("Error in verifyStudent:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while verifying the student.",
    });
  }
};

export const getUnverifiedStudents = async (req, res) => {
  try {
    const unverified = await StudentInfo.find({ verified: false }).select(
      "-password"
    );
    res.status(200).json({ success: true, students: unverified });
  } catch (err) {
    console.error("Error in getUnverifiedStudents:", err);
    res.status(500).json({ message: "Failed to fetch unverified students" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const updated = await StudentInfo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ student: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateFields = { ...req.body };

    // If a new profile image is uploaded
    if (req.file) {
      updateFields.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedStudent = await StudentInfo.findByIdAndUpdate(
      studentId,
      updateFields,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ student: updatedStudent });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ message: "Error updating student", error });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const deleted = await StudentInfo.findByIdAndDelete(studentId);
    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFilteredStudents = async (req, res) => {
  try {
    const { class: studentClass, year } = req.query;

    if (!studentClass || !year) {
      return res.status(400).json({ message: "Missing class or year" });
    }

    const students = await StudentInfo.find({
      class: studentClass,
      yearOfAdmission: year,
      verified: true,
    }).select("_id name enrollment"); // Only send required fields

    res.status(200).json({ students });
  } catch (err) {
    console.error("Error fetching filtered students:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentByEnrollment = async (req, res) => {
  try {
    const student = await StudentInfo.findOne({ enrollment: req.params.enroll }).select("-password");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, student });
  } catch (err) {
    console.error("Error in getStudentByEnrollment:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

