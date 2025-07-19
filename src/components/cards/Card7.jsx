// src/components/cards/Card7.jsx

import React, { useState } from "react";
import ViewStudentProfile from "../ViewStudentProfile";
import defaultMale from "../../images/male.png";
import defaultFemale from "../../images/female.png";

const Card7 = ({ student, onStudentUpdated, onStudentDeleted }) => {
  const [showProfile, setShowProfile] = useState(false);

  const imageUrl = student.profileImage
    ? `http://localhost:5000${student.profileImage}`
    : student.gender === "female"
    ? defaultFemale
    : defaultMale;

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center">
        <img
          src={imageUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-slate-600"
        />
        <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
        <p className="text-sm text-gray-500">
          {student.class} - {student.enrollment}
        </p>
        <button
          onClick={() => setShowProfile(true)}
          className="mt-4 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          View Profile
        </button>
      </div>

      {showProfile && (
        <ViewStudentProfile
          student={student}
          onClose={() => setShowProfile(false)}
          onStudentUpdated={onStudentUpdated}
          onStudentDeleted={onStudentDeleted} // ✅ Fixed: pass prop properly
        />
      )}
    </>
  );
};

export default Card7;
