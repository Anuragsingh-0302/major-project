// src/components/Card6.jsx

import React from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ImDownload } from "react-icons/im";
import { showSuccess , showError } from "../utils/toastUtils";

const Card6 = ({ data, isHOD }) => {
  const handleDownload = () => {
    const fileUrl = `http://localhost:5000${data.file?.replace(/\\/g, "/")}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = data.title || "timetable";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/timetable/delete/${data._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await res.json();
      if (result.success) {
        showSuccess("Timetable deleted successfully!");
        window.location.reload();
      } else {
        showError(result.message || "Failed to delete timetable");
      }
    } catch (err) {
      console.error("Error deleting timetable:", err);
    }
  };

  const formattedDate = new Date(data.createdAt).toLocaleDateString("en-GB");

  return (
    <div className="timetablecard p-2 bg-white flex flex-col justify-between rounded-xl w-full shadow-md">
      <div className="card-body flex flex-col gap-2 p-4 rounded-lg bg-slate-300 text-black mb-2">
        <div className="font-semibold text-lg">{data.title}</div>
        <div>Uploaded on: {formattedDate}</div>
        <div>Class: {data.className}</div>
        <div>Year: {data.year}</div>
      </div>
      <div className="card-footer flex justify-between px-4 py-2">
        {isHOD && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-full bg-red-600 text-white hover:scale-105"
          >
            <RiDeleteBin5Fill />
          </button>
        )}
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-full bg-blue-600 text-white hover:scale-105"
        >
          <ImDownload />
        </button>
      </div>
    </div>
  );
};

export default Card6;
