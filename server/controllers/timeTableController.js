// controllers/timeTableController.js

import TimeTable from "../models/TimeTableInfo.js";

// Upload new timetable (HOD only)
export const uploadTimeTable = async (req, res) => {
  try {
    const { type, title, date, className, year } = req.body;

    // 🔥 Normalize file path to use forward slashes for frontend compatibility
    const file = req.file? "/" + req.file.path.replace(/\\/g, "/") : null;
    const uploadedBy = req.hod._id;

    if (
      !type ||
      !title ||
      !date ||
      !file ||
      !className ||
      !year ||
      !uploadedBy
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newTimeTable = new TimeTable({
      type,
      title,
      date,
      file,
      className,
      year,
      uploadedBy,
    });

    await newTimeTable.save();
    res.status(201).json({ success: true, timeTable: newTimeTable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

// Get timetables (students, teachers, HODs – all can access)
export const getTimeTables = async (req, res) => {
  try {
    const { type, className, year } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (className) filter.className = className;
    if (year) filter.year = year;

    const timeTables = await TimeTable.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, timeTables });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Fetching failed" });
  }
};

// Delete timetable (HOD only)
export const deleteTimeTable = async (req, res) => {
  try {
    const timeTable = await TimeTable.findByIdAndDelete(req.params.id);
    if (!timeTable) {
      return res
        .status(404)
        .json({ success: false, message: "Timetable not found" });
    }
    res.status(200).json({ success: true, message: "Timetable deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};
