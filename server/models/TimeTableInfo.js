// models/TimeTableInfo.js

import mongoose from "mongoose";

const timeTableSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["class", "exam"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    file: {
      type: String, // URL to image/pdf
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherInfo" ,// uploaded by HOD
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("TimeTable", timeTableSchema);
