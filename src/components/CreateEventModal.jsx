// src/components/CreateEventModal.jsx

import React, { useState } from "react";
import axios from "axios";

const CreateEventModal = ({ onClose, onEventCreated }) => {
  const [formData, setFormData] = useState({
    eventId: "",
    title: "",
    description: "",
    link: "",
    lastDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
        console.log("Form Data:", formData); // 👈 Yeh line add karo
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.post(
        "http://localhost:5000/api/event/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Created:", res.data);
      onEventCreated(); // refresh event list
      onClose(); // close modal
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-center">Create Event</h2>
        <input
          type="text"
          name="eventId"
          placeholder="Event ID"
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="link"
          placeholder="Google Form Link"
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="date"
          name="lastDate"
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-red-500 font-semibold">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
