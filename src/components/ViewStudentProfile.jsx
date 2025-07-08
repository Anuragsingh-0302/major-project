// src/components/ViewStudentProfile.jsx

import React, { useState, useEffect } from "react";
import defaultMale from "../images/male.png";
import defaultFemale from "../images/female.png";
import UpdateStudentProfileModal from "./UpdateStudentProfileModal";
import ChatModal from "./chat/ChatModal";
import useUnreadStatus from "../hooks/useUnreadStatus";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";

const ViewStudentProfile = ({ student, onClose, onStudentUpdated, onStudentDeleted }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [studentData, setStudentData] = useState(student);
  const [showChatModal, setShowChatModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const hasUnread = useUnreadStatus(student._id);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setCurrentUser(parsed);
    }
  }, []);

  if (!student) return null;

  const imageUrl = studentData.profileImage
    ? `http://localhost:5000${studentData.profileImage}`
    : studentData.gender === "female"
    ? defaultFemale
    : defaultMale;

  return (
    <>
      <Helmet>
        <title>Viewing {studentData.name}'s Profile - DeptHub</title>
      </Helmet>

      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-3xl rounded-xl p-6 overflow-y-auto max-h-[95vh] shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold text-blue-700">
                {studentData.name} - {studentData.enrollment}
              </h2>
              <button
                onClick={onClose}
                className="text-xl font-bold text-red-600 hover:scale-110 transition"
              >
                ✕
              </button>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center mb-5">
              <img
                src={imageUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 shadow-md"
              />
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Detail label="Name" value={studentData.name} />
              <Detail label="Enrollment" value={studentData.enrollment} />
              <Detail label="Email" value={studentData.email} />
              <Detail label="Phone" value={studentData.phone} />
              <Detail label="Father's Name" value={studentData.fatherName} />
              <Detail label="Gender" value={studentData.gender} />
              <Detail label="Class" value={studentData.class} />
              <Detail label="Year of Admission" value={studentData.yearOfAdmission} />
              <Detail label="Address" value={studentData.address} />
              <Detail label="Aadhaar Number" value={studentData.aadhaarNumber} />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setShowChatModal(true)}
                className="relative bg-sky-600 text-white px-5 py-2 rounded-full hover:bg-sky-700 shadow-md flex items-center gap-2"
              >
                Chat
                {hasUnread && (
                  <span className="absolute top-0 right-0">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                )}
              </button>

              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 shadow-md"
                onClick={() => setShowUpdateModal(true)}
              >
                Update Profile
              </button>
            </div>

            {/* Update Modal */}
            {showUpdateModal && (
              <UpdateStudentProfileModal
                student={studentData}
                onClose={() => setShowUpdateModal(false)}
                onUpdated={(updatedStudent) => {
                  setStudentData(updatedStudent);
                  onStudentUpdated && onStudentUpdated(updatedStudent);
                }}
                onDeleted={(deletedStudentId) => {
                  setShowUpdateModal(false);
                  onStudentDeleted && onStudentDeleted(deletedStudentId);
                }}
              />
            )}

            {/* Chat Modal */}
            {showChatModal && currentUser && (
              <>
              {console.log("Selected Student:", studentData)}
              <ChatModal
                receiver={{
                  _id: studentData._id,
                  name: studentData.name,
                  enrollment: studentData.enrollment,
                  role: "StudentInfo",
                }}
                currentUser={currentUser}
                onClose={() => setShowChatModal(false)}
              />
              </>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <span className="font-semibold text-gray-700">{label}:</span>{" "}
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

export default ViewStudentProfile;
