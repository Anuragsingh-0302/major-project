import fs from 'fs';
import path from 'path';
import ChatMessage from '../models/chat/ChatMessage.js';

const MEDIA_DIR = path.join(process.cwd(), 'uploads', 'chat');

export const deleteOldMediaFiles = async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Find messages with media older than 7 days
  const oldMessages = await ChatMessage.find({
    media: { $exists: true, $ne: null },
    createdAt: { $lt: sevenDaysAgo },
  });

  for (const msg of oldMessages) {
    const filePath = path.join(MEDIA_DIR, path.basename(msg.media));
    
    // Delete the file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted media file: ${filePath}`);
      }
    } catch (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    }

    // Remove media reference from message
    msg.media = undefined;
    await msg.save();
  }

  console.log('Old media deletion completed.');
};
