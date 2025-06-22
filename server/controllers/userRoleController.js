import Teacher from "../models/TeacherInfo.js";
import StudentInfo from "../models/StudentInfo.js";

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ role: "teacher" }).select(
      "-password"
    );
    res.status(200).json({ success: true, teachers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllLibrarians = async (req, res) => {
  try {
    const librarians = await Teacher.find({ role: "librarian" }).select(
      "-password"
    );
    res.status(200).json({ success: true, librarians });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllHODs = async (req, res) => {
  try {
    const hods = await Teacher.find({ role: "hod" }).select("-password");
    res.status(200).json({ success: true, hods: hods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await StudentInfo.find({ verified: true }).select(
      "-password"
    );
    res.status(200).json({ success: true, students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentsByClass = async (req, res) => {
  try {
    const { className } = req.params;
    const students = await StudentInfo.find({ class: className });
    res.status(200).json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllTeachersLibrariansDetails = async (req, res) => {
  try {
    const teachers = await Teacher.find({ role: "teacher" }).select(
      "-password"
    );
    const librarians = await Teacher.find({ role: "librarian" }).select(
      "-password"
    );

    // Combine both in one array
    const allProfiles = [...teachers, ...librarians];

    res.status(200).json({ success: true, users: allProfiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyMates = async (req, res) => {
  try {
    const { class: className, yearOfAdmission, enrollment } = req.user;

    const mymates = await StudentInfo.find({
      class: className, // 👈 renamed local variable to avoid keyword conflict
      yearOfAdmission,
      enrollment: { $ne: enrollment },
    }).select("-password");

    res.status(200).json({ success: true, mates: mymates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const getFilteredStudents = async (req, res) => {
  try {
    const { className, yearOfAdmission } = req.query;

    const query = {};
    if (className) query.class = className;
    if (yearOfAdmission) query.yearOfAdmission = Number(yearOfAdmission);

    const students = await StudentInfo.find(query);

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (err) {
    console.error("getFilteredStudents error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};