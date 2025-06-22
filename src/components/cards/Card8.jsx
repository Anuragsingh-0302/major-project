// src/components/cards/Card8.jsx

import React from "react";
import { RiDeleteBin3Fill } from "react-icons/ri";
import UpdateBookModal from "../modals/UpdateBookModal";
import { useState } from "react";
import axios from "axios";
import defaultBook from "../../images/default-book.jpeg"; // Fallback image
import { showSuccess , showError } from "../../utils/toastUtils";

const Card8 = ({ book, fetchBooks }) => {
  const [showModal, setShowModal] = useState(false);
  const bookPhoto = book.bookPhoto ? `http://localhost:5000${book.bookPhoto}` : defaultBook;  // Use book photo if available, otherwise use default
 // Fallback image

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this book?");
    if (!confirm) return;

    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/library-book/delete-book/${book._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        showSuccess("Book deleted successfully!");
        fetchBooks(); // Refresh book list
      }
    } catch (err) {
      console.error("Delete failed", err);
      showError("Failed to delete book.");
    }
  };

  return (
    <>
      <div className="card bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center">
        <div className="flex w-full items-center justify-center gap-4">
          <div className="w-1/2 pl-5 items-center">
            <img
              src={bookPhoto}
              alt="bookPhoto"
              className="w-24 h-25 rounded-sm object-cover mb-2 border"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-book.jpg"; // fallback image
              }}
            />
          </div>
          <div className="w-1/2 flex flex-col items-center pb-3 gap-1 mt-3">
            <div className="text-start px-3 w-full">{book.bookId}</div>
            <div className="text-start px-3 w-full font-bold">{book.bookName}</div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 mt-3 w-full">
          <div className="text-start px-3 w-full">Author: {book.author}</div>
          <div className="text-start px-3 w-full">Publisher: {book.publisher}</div>
          <div className="text-start px-3 w-full">Year: {book.publicationYear}</div>
        </div>
        <div className="flex items-center justify-between w-full mt-4 p-2">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            <RiDeleteBin3Fill className=" text-xl" />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>

      {/* Update Modal */}
      {showModal && (
        <UpdateBookModal
          book={book}
          fetchBooks={fetchBooks}
          closeModal={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Card8;
