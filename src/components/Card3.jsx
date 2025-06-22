// src/components/Card3.jsx

// src/components/Card3.jsx

import React, { useState, useEffect } from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import defaultMale from "../images/male.png";
import defaultFemale from "../images/female.png";
import ChatModal from "./chat/ChatModal";
import Tilt from "react-parallax-tilt";
import useUnreadStatus from "../hooks/useUnreadStatus";

const Card3 = ({ user }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
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
    <>
      <div className="myMates p-3 rounded-xl flex justify-center w-full min-h-[100px] transition-all border-2 border-white duration-300 bg-slate-600">
        {/* Profile */}
        <div className="profile flex flex-col justify-center items-center gap-2 w-1/4">
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.0}
            scale={1.07}
            transitionSpeed={500}
          >
            <img
              src={imageUrl}
              alt="student profile"
              className="img w-[90px] h-[90px] rounded-full  border-2 border-slate-800 object-cover"
            />
          </Tilt>
        </div>

        {/* Details */}
        <div className="details text-white border-x-4 border-slate-400 text-lg py-2 px-3 flex flex-col justify-start items-center gap-2 w-2/4">
          <div className="name">{user.name || "N/A"}</div>
          <div className="class text-sm font-mono">{user.class || "N/A"}</div>
          <div className="enrollment text-sm font-mono">{user.enrollment || "N/A"}</div>
        </div>

        {/* Chat Button */}
        <div className="chat flex justify-center items-center gap-2 w-1/4">
          <div className="rounded-xl py-3 font-semibold w-full flex justify-center px-4">
            <button
              onClick={() => setIsChatOpen(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-700 hover:scale-105 transition-all duration-200 text-white px-4 py-3 rounded-full text-lg font-medium shadow"
            >
              Chat <HiChatBubbleLeftRight className="text-base" />
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
      {isChatOpen && currentUser && (
        <ChatModal
          receiver={{
            _id: user._id,
            name: user.name,
            enrollment: user.enrollment,
            role: "StudentInfo",
          }}
          currentUser={currentUser}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
};

export default Card3;
