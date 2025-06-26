// src/components/modals/AddNotificationModal.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { showSuccess, showError } from "../../utils/toastUtils";
import axios from "axios";

const AddNotificationModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/notifications/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccess("✅ Notification created!");
      onCreated(res.data.notification);
      onClose();
    } catch (err) {
      console.error("Create notification error:", err);
      showError("❌ Failed to create notification.");
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
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-blue-700">Add Notification</h2>
            <button
              onClick={onClose}
              className="text-red-600 text-xl font-bold hover:scale-110 transition"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="w-full border px-3 py-2 rounded"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Description"
              required
              className="w-full border px-3 py-2 rounded"
            />

            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Link (optional)"
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddNotificationModal;
