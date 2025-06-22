// server/src/models/chat/ChatMessage.js

import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
      required: true,
    },
    senderModel: {
      type: String,
      enum: ["StudentInfo", "TeacherInfo"],
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "receiverModel",
      required: true,
    },
    receiverModel: {
      type: String,
      enum: ["StudentInfo", "TeacherInfo"],
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    media: {
      type: String, // path to uploaded file (if any)
      default: null,
    },
    mediaType: {
      type: String,
      enum: ["image", "pdf", null],
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
