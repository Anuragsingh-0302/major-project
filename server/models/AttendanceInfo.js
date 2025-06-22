// models/AttendanceInfo.js

import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    class: {
      type: String,
      required: true,
    },
    year: {
      type: String, // kept as string to match frontend entry
      required: true,
    },
    date: {
      type: String, // stored in 'YYYY-MM-DD' format
      required: true,
    },
    teacherId: {
      type: String, // not ObjectId — taken from localStorage
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    students: [
      {
        studentName: {
          type: String,
          required: true,
        },
        enrollment: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", AttendanceSchema);
