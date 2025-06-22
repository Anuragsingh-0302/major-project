// src/components/cards/Card9.jsx

import React from "react";
import axios from "axios";
import { FaAddressCard } from "react-icons/fa6";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { showSuccess , showError } from "../../utils/toastUtils";

const Card9 = ({ issuer, fetchIssuers }) => {
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/library-issued/delete/${issuer._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        showSuccess("✅ Issuer deleted successfully!");
        fetchIssuers();
      }
    } catch (err) {
      console.error(err);
      showError("❌ Failed to delete issuer");
    }
  };

  const handleMarkSubmitted = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/library-issued/extend/${issuer._id}`,
        {
          newDate: new Date(),
          isReturned: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        showSuccess("✅ Issuer marked as submitted!");
        fetchIssuers();
      }
    } catch (err) {
      console.error(err);
      showError("❌ Failed to mark issuer as submitted");
    }
  };

  return (
    <div className="studentdetailscard bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center">
      <div className="w-full font-semibold text-center py-3 px-5">
        <h2 className="text-lg text-blue-700">
          {issuer.student?.name || "Issuer Name"}
        </h2>
      </div>
      <div className="w-full grid grid-cols-2">
        <div className="px-2 py-1 text-start font-sans ">
          {issuer.student?.enrollment}
        </div>
        <div className="px-2 py-1 text-start font-sans ">
          {issuer.className}
        </div>
        <div className="px-2 py-1 text-start font-sans ">
          {issuer.book?.bookId}
        </div>
        <div className="px-2 py-1 text-start font-sans ">
          {issuer.book?.bookName}
        </div>
        <div className="px-2 py-1 text-start font-sans ">
          {new Date(issuer.issueDate).toLocaleDateString()}
        </div>
        <div className="px-2 py-1 text-start font-sans ">
          {issuer.isReturned
            ? "Submitted"
            : new Date(issuer.submissionDate).toLocaleDateString()}
        </div>
      </div>

      <div className="flex items-center justify-between w-full mt-4 p-2">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
        >
          <RiDeleteBin3Fill className=" text-xl" />
        </button>
        {!issuer.isReturned && (
          <button
            onClick={handleMarkSubmitted}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Submitted
          </button>
        )}
      </div>
    </div>
  );
};

export default Card9;
