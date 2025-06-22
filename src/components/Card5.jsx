// src/components/Card5.jsx

import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import defaultMale from "../images/male.png";
import defaultFemale from "../images/female.png";

const Card5 = ({ participant, userRole, onDelete, title, eventId }) => {

  const imageUrl = participant.profileImage
        ? `http://localhost:5000${participant.profileImage}`
        : participant.gender === "female"
        ? defaultFemale
        : defaultMale;

  return (
    <div className="participants w-full py-2 px-4 bg-[#505081] flex justify-center items-center rounded-l-full rounded-r-3xl">
      <div className="w-1/3 flex justify-start border-r-4 mr-3 border-slate-200 pl-3">
        <div className="img w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-slate-200">
          <img
            src={imageUrl} // ✅ FIXED
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="details w-2/3 flex flex-col gap-1">
        <div className="eventdetail flex justify-between px-2 py-1 text-blue-100 text-lg">
          <div className="eventid w-[50%]">{eventId || "-"}</div> {/* ✅ FIXED */}
          <div className="eventname w-[50%]">{title || "-"}</div> {/* ✅ FIXED */}
        </div>
        <div className="nameenroll flex justify-between px-2 py-1 text-blue-100 text-lg">
          <div className="name w-[50%]">{participant.name}</div>
          <div className="enroll w-[50%]">{participant.enrollment}</div>
        </div>
        <div className="classyear flex justify-between px-2 py-1 text-blue-100 text-lg">
          <div className="class w-[50%]">{participant.class}</div>
          <div className="year w-[50%]">{participant.yearOfAdmission}</div>
        </div>
      </div>

      {["teacher", "hod"].includes(userRole) && (
        <button
          className="ml-4 p-2 text-red-400 hover:text-red-600"
          onClick={onDelete}
        >
          <FaTrashAlt size={20} />
        </button>
      )}
    </div>
  );
};

export default Card5;
