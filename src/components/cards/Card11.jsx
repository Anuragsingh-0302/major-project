// src/components/cards/Card11.jsx

import React from "react";
import defaultMale from "../../images/male.png";
import defaultFemale from "../../images/female.png";

const Card11 = ({ user, role, onChatClick }) => {
  const imageUrl = user.profileImage
    ? `http://localhost:5000${user.profileImage}`
    : user.gender === "female"
    ? defaultFemale
    : defaultMale;
  return (
    <div className="bg-white w-full rounded-xl shadow flex items-center justify-between p-4 border hover:shadow-md transition duration-300">
      <div className="flex items-center gap-4">
        <img
          src={imageUrl}
          alt="User"
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-gray-500 text-sm">
            {role === "StudentInfo" ? user.enrollment : user.teacherId}
          </p>
        </div>
      </div>
      <button
        onClick={onChatClick}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg ml-2 text-sm transition"
      >
        Chat
      </button>
    </div>
  );
};

export default Card11;
