//routes/chatRoutes.js


import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyUserToken } from '../middlewares/verifyUserToken.js';
import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
  deleteAllMessages,
  getUnreadMessages,
  getUserConversations, // ✅ NEW: for joining all rooms on login (optional)
  getFullUserConversations, // ✅ NEW: for full MyChats info
} from '../controllers/chatController.js';

const router = express.Router();

// ✅ Multer config for chat media uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/chat');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  }
});
const upload = multer({ storage });

// ✅ Routes

// Create or fetch a conversation
router.post('/conversation', verifyUserToken, getOrCreateConversation);

// Send message (with media support)
router.post('/message', verifyUserToken, upload.single('media'), sendMessage);

// Get all messages in a conversation
router.get('/messages/:id', verifyUserToken, getMessages);

// Delete all messages from a conversation
router.delete('/delete-all/:conversationId', verifyUserToken, deleteAllMessages);

// Get unread messages from a specific user
router.get('/unread/:otherUserId', verifyUserToken, getUnreadMessages);

// ✅ Optional: get all conversation IDs of current user (for socket room join)
router.get('/my-conversations', verifyUserToken, getUserConversations); // [NEW route]

// ✅ NEW: Get full conversation list with user info
router.get('/my-full-conversations', verifyUserToken, getFullUserConversations);

export default router;
