//src/components/notes/NoteCard.jsx

import React from "react";
import { IoEyeOutline, IoDownloadOutline } from "react-icons/io5";

const NoteCard = ({ note, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border flex flex-col gap-1 justify-between">
      <h2 className="text-xl font-bold mb-2">{note.title}</h2>
      <p className="text-sm text-gray-700 mb-2">{note.subject}</p>
      <div className="flex justify-between items-center mt-auto">
        {/* 👁 View button */}
        <button
          onClick={() => onView(note)}
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          <IoEyeOutline /> View
        </button>

        {/* ⬇ Download button */}
        <a
          href={`http://localhost:5000${note.file}`}
          download
          className="text-green-600 hover:underline flex items-center gap-1"
        >
          <IoDownloadOutline /> Download
        </a>
      </div>
    </div>
  );
};

export default NoteCard;
