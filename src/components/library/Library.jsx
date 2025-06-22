// src/components/libraryManagement/Library.jsx

// src/components/libraryManagement/Library.jsx

import React, { useState, useEffect } from "react";
import Card8 from "../cards/Card8";
import Card9 from "../cards/Card9";
import AddBookForm from "./AddBookForm";
import AddIssuerForm from "../library/AddIssuerForm";
import axios from "axios";
import { FaAddressBook, FaAddressCard } from "react-icons/fa6";

const Library = () => {
  const [view, setView] = useState("book");
  const [books, setBooks] = useState([]);
  const [issuers, setIssuers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssuerModal, setShowIssuerModal] = useState(false);

  useEffect(() => {
    document.title = "DeptHub - Library Management";
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/library-book/all-book");
      if (res.data.success) setBooks(res.data.books);
    } catch (err) {
      console.error("Error fetching books", err);
    }
  };

  const fetchIssuers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/library-issued/display", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setIssuers(res.data.issuedBooks);
    } catch (err) {
      console.error("Error fetching issuers", err);
    }
  };

  useEffect(() => {
    if (view === "book") fetchBooks();
    else fetchIssuers();
  }, [view]);

  return (
    <div className="library flex flex-col items-center min-h-[90vh] bg-gray-100 w-full relative">
      {/* Top Navbar */}
      <div className="navbar w-full flex justify-between p-3 bg-slate-700 text-white">
        <div
          className={`w-1/2 text-center font-semibold cursor-pointer ${view === "book" ? "underline text-yellow-400" : ""}`}
          onClick={() => setView("book")}
        >
          Books Detail
        </div>
        <div
          className={`w-1/2 text-center font-semibold cursor-pointer ${view === "issuer" ? "underline text-yellow-400" : ""}`}
          onClick={() => setView("issuer")}
        >
          Issuer Detail
        </div>
      </div>

      {/* Cards Section */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {view === "book"
          ? books.map((book) => (
              <Card8 key={book._id} book={book} fetchBooks={fetchBooks} />
            ))
          : issuers.map((issuer) => (
              <Card9 key={issuer._id} issuer={issuer} fetchIssuers={fetchIssuers} />
            ))}
      </div>

      {/* Add Book Button (book view only) */}
      {view === "book" && (
        <div className="fixed bottom-10 right-10 z-50">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white hover:scale-105 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span className="text-xl"><FaAddressBook /></span> <span>Add Book</span>
          </button>
        </div>
      )}

      {/* Add Issuer Button (issuer view only) */}
      {view === "issuer" && (
        <div className="fixed bottom-10 right-10 z-50">
          <button
            onClick={() => setShowIssuerModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white hover:scale-105 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaAddressCard />
            <span>Add Issuer</span>
          </button>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <dialog open className="rounded-xl p-0 backdrop:bg-black/30">
          <div className="bg-white rounded-xl p-6 min-w-[300px] w-[90vw] max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-700">Add New Book</h2>
              <button
                className="text-red-600 font-bold text-xl"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <AddBookForm fetchBooks={fetchBooks} closeModal={() => setShowAddModal(false)} />
          </div>
        </dialog>
      )}

      {/* Add Issuer Modal */}
      {showIssuerModal && (
        <AddIssuerForm
          fetchIssuers={fetchIssuers}
          closeModal={() => setShowIssuerModal(false)}
        />
      )}
    </div>
  );
};

export default Library;
