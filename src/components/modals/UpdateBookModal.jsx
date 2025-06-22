// src/components/modals/UpdateBookModal.jsx

// src/components/modals/UpdateBookModal.jsx

import React, { useState } from "react";
import axios from "axios";

const UpdateBookModal = ({ book, fetchBooks, closeModal }) => {
  const [formData, setFormData] = useState({
    bookId: book.bookId,
    bookName: book.bookName,
    author: book.author,
    publisher: book.publisher,
    publicationYear: book.publicationYear,
  });

  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      form.append(key, val);
    });
    if (photo) form.append("bookPhoto", photo);

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/library-book/update-book/${book._id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        alert("✅ Book updated successfully!");
        fetchBooks();
        closeModal(); // Close modal passed via props
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
    >
      <div className="w-full max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg relative">
        <h3 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Update Book Details
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
              placeholder="Book ID"
              required
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              placeholder="Book Name"
              required
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author"
              required
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Publisher"
              className="input input-bordered w-full"
            />
            <input
              type="number"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              placeholder="Publication Year"
              className="input input-bordered w-full"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Updating..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateBookModal;
