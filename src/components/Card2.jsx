// src/components/Card2.jsx

// src/components/Card2.jsx

import React, { useState, useEffect } from "react";
import defaultMale from "../images/male.png";
import defaultFemale from "../images/female.png";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import Tilt from "react-parallax-tilt";
import ChatModal from "./chat/ChatModal";
import useUnreadStatus from "../hooks/useUnreadStatus";

const Card2 = ({ user }) => {
  const [showChatModal, setShowChatModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const imageUrl = user.profileImage
    ? `http://localhost:5000${user.profileImage}`
    : user.gender === "female"
    ? defaultFemale
    : defaultMale;

  const hasUnread = useUnreadStatus(user._id);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setCurrentUser(parsed);
    }
  }, []);

  return (
    <div className="min-h-[90vh] w-full flex justify-center items-center p-4 bg-gradient-to-br from-[#e0e7ff] to-[#f8fafc]">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden border border-gray-200 transition-all duration-300">
        {/* Left Section */}
        <div className="md:w-2/5 w-full p-6 flex flex-col items-center justify-center gap-6 bg-white/70 border-b md:border-b-0 md:border-r border-gray-300">
          <Tilt glareEnable={true} glareMaxOpacity={0.2} scale={1.05} transitionSpeed={250}>
            <img
              src={imageUrl}
              alt="Profile"
              className="w-[200px] h-[200px] md:w-[220px] md:h-[220px] rounded-full shadow-lg shadow-slate-600 border-2 border-white object-cover"
            />
          </Tilt>
          <div className="text-slate-800 text-lg font-semibold bg-yellow-400 px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition">
            HOD ID - {user.teacherId}
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-3/5 w-full bg-gradient-to-br from-slate-100 to-slate-300 p-6 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            {[user.name, user.email,
              Array.isArray(user.subject) ? user.subject.join(", ") : user.subject,
              Array.isArray(user.department) ? user.department.join(", ") : user.department,
              user.phone,
              user.gender?.toUpperCase()].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/80 text-gray-800 rounded-xl px-5 py-4 text-base font-medium shadow hover:scale-[1.02] transition backdrop-blur"
              >
                {item || "N/A"}
              </div>
            ))}
          </div>

          {/* Chat Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setShowChatModal(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-700 hover:from-sky-600 hover:to-indigo-800 transition-all duration-200 text-white px-6 py-3 rounded-full text-lg font-medium shadow hover:scale-105"
            >
              Chat <HiChatBubbleLeftRight className="text-xl" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 flex">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && currentUser && (
        <ChatModal
          receiver={{
            _id: user._id,
            name: user.name,
            teacherId: user.teacherId,
            role: "TeacherInfo",
          }}
          currentUser={currentUser}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
};

export default Card2;
