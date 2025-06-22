// src/components/timetables/TimeTableFormModal.jsx

import React, { useState } from "react";

const TimeTableFormModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    className: "",
    year: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized");
      return;
    }

    const body = new FormData();
    body.append("type", formData.type);
    body.append("title", formData.title);
    body.append("className", formData.className);
    body.append("year", formData.year);
    body.append("date", new Date()); // createdAt-like field
    body.append("file", formData.file);

    try {
      const res = await fetch("http://localhost:5000/api/timetable/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const result = await res.json();

      if (result.success) {
        alert("Time table uploaded successfully");
        onClose();
        window.location.reload();
      } else {
        alert("Upload failed: " + result.message);
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-800">
          Upload Time Table
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Select Type</option>
            <option value="class">Class</option>
            <option value="exam">Exam</option>
          </select>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="className"
            placeholder="Class (e.g. MCA 2)"
            value={formData.className}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="file"
            name="file"
            accept=".pdf, image/*"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeTableFormModal;
