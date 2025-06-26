// src/components/Card5.jsx

import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import defaultMale from "../images/male.png";
import defaultFemale from "../images/female.png";

const Card5 = ({ participant, userRole, onDelete }) => {
  const imageUrl = participant.profileImage
    ? `http://localhost:5000${participant.profileImage}`
    : participant.gender === "female"
    ? defaultFemale
    : defaultMale;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full max-w-4xl mx-auto my-4 px-6 py-5 bg-slate-800 backdrop-blur-md border border-slate-500 rounded-3xl shadow-xl flex md:flex-col  items-center transition-all relative"
    >
      {/* Image */}
      <div className="flex-shrink-0 pl-2 md:pl-0">
        <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-slate-300 shadow-md">
          <img
            src={imageUrl}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Details */}
      <div className="ml-5 md:ml-2 flex flex-col gap-[2px] justify-center  text-slate-100 w-full">
        {/* Name & Enrollment */}
        <span>
          Name :&nbsp;&nbsp;{" "}<span className="font-medium text-yellow-400">{participant.name}</span>
        </span>
        <span>
          Enrollment :&nbsp;&nbsp;{" "}<span className="font-medium text-yellow-400">{participant.enrollment}</span>
        </span>

        {/* Class & Year */}

        <span>
          Class :&nbsp;&nbsp;{" "}<span className="font-medium text-yellow-400">{participant.class}</span>
        </span>
        <span>
          Year :&nbsp;&nbsp;{" "}<span className="font-medium text-yellow-400">{participant.yearOfAdmission}</span>
        </span>
      </div>

      {/* Delete Button */}
      {["teacher", "hod"].includes(userRole) && (
        <button
          onClick={onDelete}
          className=" p-1 rounded-full  transition duration-300 text-white hover:text-red-500 shadow-md absolute top-2 left-4 sm:left-auto sm:right-4"
          title="Remove Participant"
        >
          <FaTrashAlt size={18} />
        </button>
      )}
    </motion.div>
  );
};

export default Card5;
