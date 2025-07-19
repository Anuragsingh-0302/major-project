// src/components/cards/Card1.jsx

import React, { useState, useEffect } from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import defaultMale from "../../images/male.png";
import defaultFemale from "../../images/female.png";
import UpdateTeacherForm from "../UpdateTeacherForm";
import Tilt from "react-parallax-tilt";
import ChatModal from "../chat/ChatModal";
import useUnreadStatus from "../../hooks/useUnreadStatus";

const Card1 = ({ user, fetchProfiles }) => {
  const [isHOD, setIsHOD] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const hasUnread = useUnreadStatus(user._id);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      if (parsedUser?.role === "hod") {
        setIsHOD(true);
      }
    }
  }, []);

  const imageUrl = user.profileImage
    ? `http://localhost:5000${user.profileImage}`
    : user.gender === "female"
    ? defaultFemale
    : defaultMale;

  return (
    <div className="rounded-3xl relative">
      <div className="card flex flex-col justify-start items-center p-4 min-h-[400px] bg-gradient-to-r from-white to-gray-300 rounded-2xl shadow-xl hover:shadow-lg transition-all duration-300 m-4">
        {/* Profile Image & Info */}
        <div className="flex flex-col items-center w-full">
          <Tilt glareEnable={true} glareMaxOpacity={0.2} scale={1.05} transitionSpeed={250}>
            <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-slate-800 mb-3">
              <img className="w-full h-full object-cover" src={imageUrl} alt="profile" />
            </div>
          </Tilt>
          <div className="grid grid-cols-2 gap-2 w-full text-center">
            <div className="py-1 font-semibold">{user.teacherId || "N/A"}</div>
            <div className="py-1 font-sans">{user.name}</div>
            <div className="py-1 font-sans">
              {Array.isArray(user.subject) ? user.subject.join(", ") : user.subject || "N/A"}
            </div>
            <div className="py-1 font-sans">
              {Array.isArray(user.department)
                ? user.department.join(", ")
                : user.department || "N/A"}
            </div>
            <div className="py-1 font-sans">{user.phone}</div>
            <div className="py-1 font-sans">{user.role?.toUpperCase() || "N/A"}</div>
          </div>
        </div>

        {/* Chat Button */}
        <div className="absolute bottom-8 right-8">
          <button
            className="relative flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-700 hover:scale-105 transition-all duration-200 text-white px-4 py-3 rounded-full text-lg font-medium shadow"
            onClick={() => setShowChatModal(true)}
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

        {/* HOD Only Update Button */}
        {isHOD && (
          <div className="absolute bottom-8 left-8">
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-500 text-black px-4 py-3 hover:scale-104 rounded-full font-bold shadow"
            >
              Update
            </button>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showModal && (
        <UpdateTeacherForm
          user={user}
          onClose={() => setShowModal(false)}
          onUpdate={() => {
            setShowModal(false);
            fetchProfiles();
          }}
          onDelete={async (id) => {
            const confirmDelete = window.confirm("Are you sure to delete this teacher?");
            if (!confirmDelete) return;

            try {
              const token = localStorage.getItem("token");
              const res = await fetch(`http://localhost:5000/api/teacher/delete/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });

              const result = await res.json();

              if (res.ok) {
                alert("Teacher deleted successfully!");
                setShowModal(false);
                fetchProfiles();
              } else {
                alert(result.message || "Delete failed");
              }
            } catch (err) {
              console.error(err);
              alert("Something went wrong");
            }
          }}
        />
      )}

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

export default Card1;
