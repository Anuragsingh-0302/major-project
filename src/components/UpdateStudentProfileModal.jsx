// src/components/UpdateStudentProfileModal.jsx

import React, { useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { showSuccess , showError } from "../utils/toastUtils";

const UpdateStudentProfileModal = ({
  student,
  onClose,
  onUpdated,
  onDeleted,
}) => {
  const [formData, setFormData] = useState({ ...student });
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    if (profileImage) {
      data.append("profileImage", profileImage);
    }

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/student/updateStudentProfile/${student._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data && res.data.student) {
        showSuccess("✅ Student profile updated successfully!");
        onUpdated(res.data.student);
        onClose();
      } else {
        showError("❌ Failed to update student profile.");
      }
    } catch (err) {
      console.error("Update error:", err);
      showError("❌ Something went wrong while updating.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      const res = await axios.delete(
        `http://localhost:5000/api/student/delete/${student._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.message === "Student deleted successfully") {
        showSuccess("✅ Student deleted successfully!");
        if (onDeleted) onDeleted(student._id); // ✅ Safe call
        onClose(); // Close modal
      } else {
        showError("❌ Failed to delete student.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showError("❌ Something went wrong while deleting.");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">
            Update Student Profile
          </h2>
          <button onClick={onClose} className="text-red-600 font-bold text-xl">
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
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
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="col-span-2 border p-2 rounded"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Update Student
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              <FaTrashAlt />
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudentProfileModal;
