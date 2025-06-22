import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true }, // Google Form or info link
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "TeacherInfo" },
    participants: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "StudentInfo" },
        name: { type: String, required: true },
        enrollment: { type: String, required: true },
        class: { type: String, required: true },
        yearOfAdmission: { type: Number, required: true },
        profileImage: { type: String }, // 👈 Add this line
      },
    ],
    createdAt: { type: Date, default: Date.now },
    lastDate: { type: Date, required: true }, // Submission deadline
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
