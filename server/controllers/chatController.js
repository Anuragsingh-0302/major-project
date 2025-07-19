// server/controllers/chatController.js

import Conversation from "../models/chat/Conversation.js";
import Message from "../models/chat/ChatMessage.js";
import { getIO } from "../socket.js"; // ✅ import io instance
import StudentInfo from "../models/StudentInfo.js";
import TeacherInfo from "../models/TeacherInfo.js";

// ✅ Create or Get Conversation
export const getOrCreateConversation = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { recipientId, recipientRole } = req.body;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { user: userId, role } },
          { $elemMatch: { user: recipientId, role: recipientRole } },
        ],
      },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [
          { user: userId, role },
          { user: recipientId, role: recipientRole },
        ],
      });
      await conversation.save();
    }

    res.status(200).json({ success: true, conversation });
  } catch (err) {
    console.error("Conversation error:", err);
    res.status(500).json({ message: "Failed to fetch/create conversation" });
  }
};

// ✅ Send Message
export const sendMessage = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { conversationId, receiverId, receiverModel } = req.body;
    const text = req.body.text || req.body.message || "";

    const filePath = req.file ? `/uploads/chat/${req.file.filename}` : null; // ✅ fixed path

    const mediaType = filePath
      ? req.file.mimetype.startsWith("image")
        ? "image"
        : req.file.mimetype === "application/pdf"
        ? "pdf"
        : null
      : null;

    const message = new Message({
      conversation: conversationId,
      sender: userId,
      senderModel: role,
      receiver: receiverId,
      receiverModel,
      message: text,
      media: filePath,
      mediaType,
      isRead: false,
    });

    const savedMessage = await message.save();

    const io = getIO();
    io.to(conversationId.toString()).emit("receiveMessage", savedMessage);

    res.status(201).json({ success: true, message: savedMessage });
  } catch (err) {
    console.error("Send error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// ✅ Get All Messages (and mark as read)
export const getMessages = async (req, res) => {
  try {
    const { id } = req.params; // conversationId
    const userId = req.user.id;

    await Message.updateMany(
      { conversation: id, receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({ conversation: id }).sort({
      createdAt: 1,
    });

    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// ✅ Delete All Messages
export const deleteAllMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.user.toString() === userId
    );
    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "Not authorized in this conversation" });
    }

    const deleted = await Message.deleteMany({ conversation: conversationId });

    res.status(200).json({
      message: "All messages deleted successfully",
      deletedCount: deleted.deletedCount,
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error while deleting messages" });
  }
};

// ✅ Get Unread Count
export const getUnreadMessages = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { otherUserId } = req.params;

    const unreadMessages = await Message.find({
      receiver: userId,
      sender: otherUserId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount: unreadMessages.length,
      unreadMessages,
    });
  } catch (err) {
    console.error("Unread check error:", err);
    res.status(500).json({ message: "Failed to check unread messages" });
  }
};

// ✅ Get All Conversations for joining rooms
// ✅ Replace existing getUserConversations with this:
export const getUserConversations = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    const conversations = await Conversation.find({
      participants: { $elemMatch: { user: userId, role } },
    }).populate("participants.user");

    res.status(200).json({
      success: true,
      conversations, // ✅ instead of conversationIds
    });
  } catch (err) {
    console.error("GetUserConversations error:", err);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};



// ✅ NEW: Get Full User Conversations (for MyChats)
export const getFullUserConversations = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    const conversations = await Conversation.find({
      participants: {
        $elemMatch: { user: userId, role },
      },
    }).sort({ updatedAt: -1 });

    const results = [];

    for (const convo of conversations) {
      const otherParticipant = convo.participants.find(
        (p) => p.user.toString() !== userId
      );

      if (!otherParticipant) continue;

      let userData;
      if (otherParticipant.role === "StudentInfo") {
        const student = await StudentInfo.findById(otherParticipant.user);
        if (!student) continue;
        userData = {
          _id: student._id,
          name: student.name,
          profileImage: student.profileImage,
          role: "student",
          enrollment: student.enrollment,
        };
      } else if (otherParticipant.role === "TeacherInfo") {
        const teacher = await TeacherInfo.findById(otherParticipant.user);
        if (!teacher) continue;
        userData = {
          _id: teacher._id,
          name: teacher.name,
          profileImage: teacher.profileImage,
          role: teacher.role,
          teacherId: teacher.teacherId,
        };
      }

      results.push({
        conversationId: convo._id,
        participant: userData,
        updatedAt: convo.updatedAt,
      });
    }

    res.status(200).json({ success: true, conversations: results });
  } catch (err) {
    console.error("MyConversations Error:", err);
    res.status(500).json({ message: "Failed to get conversation list" });
  }
};

