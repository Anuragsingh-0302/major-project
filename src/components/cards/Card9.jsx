import React from "react";
import axios from "axios";
import { FaAddressCard } from "react-icons/fa6";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { showSuccess, showError } from "../../utils/toastUtils";

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
    <div className="studentdetailscard bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
      <h2 className="text-xl font-bold text-blue-700 mb-4">
        {issuer.student?.name || "Issuer Name"}
      </h2>
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Enrollment:</label>
          <span>{issuer.student?.enrollment}</span>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Class:</label>
          <span>{issuer.className}</span>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Book ID:</label>
          <span>{issuer.book?.bookId}</span>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Book Name:</label>
          <span>{issuer.book?.bookName}</span>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Issue Date:</label>
          <span>{new Date(issuer.issueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Submission Date:</label>
          <span>
            {issuer.isReturned
              ? "Submitted"
              : new Date(issuer.submissionDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between w-full mt-6">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          <RiDeleteBin3Fill className="text-xl" />
        </button>
        {!issuer.isReturned && (
          <button
            onClick={handleMarkSubmitted}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Mark as Submitted
          </button>
        )}
      </div>
    </div>
  );
};

export default Card9;
