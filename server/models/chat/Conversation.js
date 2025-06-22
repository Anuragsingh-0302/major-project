// models/chat/Conversation.js

import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: 'participants.role'
        },
        role: {
          type: String,
          required: true,
          enum: ['StudentInfo', 'TeacherInfo']
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);
