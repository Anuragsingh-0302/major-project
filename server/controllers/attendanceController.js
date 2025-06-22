// controllers/attendanceController.js

import Attendance from "../models/AttendanceInfo.js";
import Student from "../models/StudentInfo.js";
import ExcelJS from "exceljs";

// ✅ Take Attendance
export const takeAttendance = async (req, res) => {
  try {
    const { class: studentClass, year, presentStudents } = req.body;
    const user = req.user;
    const date = new Date().toISOString().split("T")[0];

    const alreadyTaken = await Attendance.findOne({
      class: studentClass,
      year,
      date,
      teacherId: user.id,
    });

    if (alreadyTaken) {
      return res
        .status(400)
        .json({ message: "Attendance already taken for this date" });
    }

    const students = await Student.find({
      class: studentClass,
      yearOfAdmission: year,
      verified: true,
    });

    const formattedStudents = students.map((student) => ({
      studentName: student.name,
      enrollment: student.enrollment,
      status: presentStudents.includes(student._id.toString())
        ? "Present"
        : "Absent",
    }));

    const newAttendance = new Attendance({
      class: studentClass,
      year,
      date,
      teacherId: user.id,
      teacherName: user.username,
      students: formattedStudents,
    });

    await newAttendance.save();
    res.status(201).json({ success: true, attendance: newAttendance });
  } catch (err) {
    console.error("Error in takeAttendance:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to take attendance" });
  }
};

// ✅ Display Attendance
export const displayAttendance = async (req, res) => {
  try {
    console.log("DISPLAY ATTENDANCE REQ QUERY:", req.query);

    const { className, year, date, teacherId } = req.query;
    const user = req.user;

    const query = {
      class: className, // ✅ matches Attendance schema
      year, // ✅ year is string
      date, // ✅ in YYYY-MM-DD format
      teacherId: teacherId || user.id, // ✅ fallback to logged-in user
    };

    const attendance = await Attendance.findOne(query);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No attendance found",
      });
    }

    res.status(200).json({ success: true, attendance });
  } catch (err) {
    console.error("Error in displayAttendance:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
};

// ✅ Export Attendance as Excel

export const exportAttendance = async (req, res) => {
  try {
    const { className, year, date, teacherId } = req.query;
    const user = req.user;

    const query = {
      class: className,
      year,
      date,
      teacherId: teacherId || user.id,
    };

    const attendance = await Attendance.findOne(query);

    if (!attendance) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance not found" });
    }

    const { default: ExcelJS } = await import("exceljs"); // ✅ Correct way
    const workbook = new ExcelJS.Workbook(); // ✅ Works

    const worksheet = workbook.addWorksheet("Attendance");

    // Add metadata rows
    worksheet.addRow([`Class: ${attendance.class}`]);
    worksheet.addRow([`Date: ${attendance.date}`]);
    worksheet.addRow([`Teacher: ${attendance.teacherName}`]);
    worksheet.addRow([]); // empty spacer row

    // Define header columns
    worksheet.columns = [
      { header: "Enrollment No", key: "enrollment", width: 20 },
      { header: "Student Name", key: "studentName", width: 30 },
      { header: "Status", key: "status", width: 15 },
    ];

    // Add student data
    attendance.students.forEach((student) => {
      worksheet.addRow({
        enrollment: student.enrollment,
        studentName: student.studentName,
        status: student.status,
      });
    });

    // 🔷 Styling the header row
    const headerRowIndex =
      worksheet.actualRowCount - attendance.students.length;
    const headerRow = worksheet.getRow(headerRowIndex);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1F4E78" }, // dark blue
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Optional: Make data rows centered and bordered
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > headerRowIndex) {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    // Safe filename
    const safeTeacherName = (attendance.teacherName || "teacher")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");
    const filename = `attendance_${attendance.class}_${safeTeacherName}_${attendance.date}.xlsx`;

    // Headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error exporting attendance:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to export attendance" });
  }
};
