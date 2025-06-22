// src/components/libraryManagement/AddBookForm.jsx

import React, { useState } from "react";
import axios from "axios";
import { showSuccess , showError } from "../../utils/toastUtils";

const AddBookForm = ({ fetchBooks, closeModal }) => {
  const [formData, setFormData] = useState({
    bookId: "",
    bookName: "",
    author: "",
    publisher: "",
    publicationYear: new Date().getFullYear(),
  });
  const [bookPhoto, setBookPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setBookPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (bookPhoto) {
      data.append("bookPhoto", bookPhoto);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/library-book/add-book",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        showSuccess("✅ Book added successfully!");
        setFormData({
          bookId: "",
          bookName: "",
          author: "",
          publisher: "",
          publicationYear: new Date().getFullYear(),
        });
        setBookPhoto(null);
        fetchBooks();
        closeModal();
      }
    } catch (err) {
      console.error(err);
      showError("❌ Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-md z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
          Add New Book
        </h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <input
            type="text"
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            placeholder="Book ID"
            required
            className="input-style input input-bordered w-full"
          />
          <input
            type="text"
            name="bookName"
            value={formData.bookName}
            onChange={handleChange}
            placeholder="Book Name"
            required
            className="input-style input input-bordered w-full"
          />
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author"
            required
            className="input-style input input-bordered w-full"
          />
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            placeholder="Publisher"
            className="input-style input input-bordered w-full"
          />
          <input
            type="number"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleChange}
            placeholder="Publication Year"
            className="input-style input input-bordered w-full"
          />
          <div className="w-full">
            <label className="block text-gray-600 text-sm mb-1">
              Book Photo
            </label>
            <input
              type="file"
              name="bookPhoto"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input file-input-bordered w-full input-style"
            />
          </div>

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
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
            >
              {isSubmitting ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;
