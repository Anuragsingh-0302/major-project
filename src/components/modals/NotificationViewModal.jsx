// src/components/modals/NotificationViewModal.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { showSuccess, showError } from "../../utils/toastUtils";
import axios from "axios";

const NotificationModal = ({ notification, role, onClose, onUpdated, onDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...notification });

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await axios.patch(
        `http://localhost:5000/api/notifications/update/${notification._id}`,
        editedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSuccess("✅ Notification updated!");
      onUpdated && onUpdated(res.data.notification);
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      showError("❌ Failed to update notification.");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Do you want to delete this notification?");
    if (!confirm) return;

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      await axios.delete(
        `http://localhost:5000/api/notifications/delete/${notification._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSuccess("✅ Notification deleted!");
      onDeleted && onDeleted(notification._id);
      onClose();
    } catch (err) {
      console.error("Delete error:", err);
      showError("❌ Failed to delete notification.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white max-w-xl w-full rounded-lg p-6 shadow-lg overflow-y-auto max-h-[90vh]"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-xl font-bold text-blue-700">Notification</h2>
            <button
              onClick={onClose}
              className="text-red-600 text-xl font-bold hover:scale-110 transition"
            >
              ✕
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Date:</span>{" "}
              {new Date(notification.date).toLocaleDateString()}
            </div>

            <div>
              <span className="font-medium text-gray-600">Title:</span>
              {isEditing ? (
                <input
                  name="title"
                  value={editedData.title}
                  onChange={handleChange}
                  className="w-full border px-3 py-1 rounded mt-1"
                />
              ) : (
                <p className="text-gray-800">{notification.title}</p>
              )}
            </div>

            <div>
              <span className="font-medium text-gray-600">Description:</span>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editedData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border px-3 py-1 rounded mt-1"
                />
              ) : (
                <p className="text-gray-800">{notification.description}</p>
              )}
            </div>

            <div>
              <span className="font-medium text-gray-600">Link:</span>
              {isEditing ? (
                <input
                  name="link"
                  value={editedData.link || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-1 rounded mt-1"
                />
              ) : (
                <a
                  href={notification.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {notification.link || "N/A"}
                </a>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-end gap-2 mt-6">
            {notification.link && !isEditing && (
              <a
                href={notification.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Click Here
              </a>
            )}

            {(role === "teacher" || role === "hod" || role === "librarian") && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            )}

            {isEditing && (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedData({ ...notification });
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationModal;
