// src/components/EditStudentModal.jsx

import React, { useState } from "react";
import axios from "axios";
import {  showError } from "../utils/toastUtils";

const EditStudentModal = ({ student, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({ ...student });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/student/update/${student._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data && res.data.student) {
        onUpdated(res.data.student); // ✅ updated student bhej do parent ko
        onClose(); // ✅ modal band
      } else {
        showError("❌ Failed to update student. Please try again.");
      }
    } catch (err) {
      console.error("Update error:", err);
      showError("❌ Update failed. Please check your input and try again.");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">Edit Student</h2>
          <button onClick={onClose} className="text-red-600 font-bold text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              name="enrollment"
              value={formData.enrollment}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="border p-2 rounded col-span-2"
            />
            <input
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select Class</option>
              <option value="MCA">MCA</option>
              <option value="BCA">BCA</option>
            </select>
            <input
              name="yearOfAdmission"
              type="number"
              value={formData.yearOfAdmission}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4"
          >
            Update Student
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
