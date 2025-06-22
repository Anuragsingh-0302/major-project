// src/components/library/AddIssuerForm.jsx

import React, { useState } from "react";
import axios from "axios";
import { showSuccess , showError } from "../../utils/toastUtils";

const AddIssuerForm = ({ fetchIssuers, closeModal }) => {
  const [formData, setFormData] = useState({
    enrollment: "",
    bookId: "",
    submissionDate: "",
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/library-issued/create",
        {
          enrollment: formData.enrollment,
          bookId: formData.bookId,
          submissionDate: formData.submissionDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        showSuccess("✅ Book issued successfully!");
        fetchIssuers();
        closeModal();
      }
    } catch (err) {
      console.error(err);
      showError("❌ Failed to issue book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-md z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700 text-center">
          Issue Book to Student
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="enrollment"
            placeholder="Student Enrollment Number"
            className="input input-bordered w-full"
            value={formData.studentEnrollment}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="bookId"
            placeholder="Book ID"
            className="input input-bordered w-full"
            value={formData.bookId}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="submissionDate"
            className="input input-bordered w-full"
            value={formData.submissionDate}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
            >
              {loading ? "Issuing..." : "Issue Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIssuerForm;
