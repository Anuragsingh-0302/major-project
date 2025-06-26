// server/controllers/notificationController.js

import Notification from "../models/Notification.js";

// CREATE
export const createNotification = async (req, res) => {
  try {
    console.log("Creating notification with body:", req.body);
    const { title, description, link } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and Description are required." });
    }

    const newNotification = new Notification({
      title,
      description,
      link,
      createdBy: req.user.id, // ✅ ye fix hai
    });

    await newNotification.save();
    res.status(201).json({ success: true, notification: newNotification });
  } catch (err) {
    console.error("Create notification error:", err);
    res.status(500).json({ success: false, message: "Failed to create notification" });
  }
};

// READ
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

// UPDATE
export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, notification: updated });
  } catch (err) {
    console.error("Update notification error:", err);
    res.status(500).json({ success: false, message: "Failed to update notification" });
  }
};

// DELETE
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error("Delete notification error:", err);
    res.status(500).json({ success: false, message: "Failed to delete notification" });
  }
};
