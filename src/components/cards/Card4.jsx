// src/components/cards/Card4.jsx

import React, { useState } from "react";
import axios from "axios";
import { showError, showSuccess } from "../../utils/toastUtils";
import { RiDeleteBin3Fill } from "react-icons/ri";

const Card4 = ({ event, user, onShowParticipants, onEventUpdated }) => {
  const currentDate = new Date();
  const eventLastDate = new Date(event.lastDate);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    title: event.title,
    description: event.description,
    link: event.link,
    lastDate: event.lastDate?.slice(0, 10),
  });

  const handleParticipate = async () => {
    const link = event.link;
    if (!link) return alert("No form link");

    try {
      await axios.post(
        `http://localhost:5000/api/event/events/${event._id}/participate`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (onEventUpdated) onEventUpdated();
      window.open(link, "_blank");
    } catch (err) {
      console.error("Participation failed:", err);
      showError("❌ Participation failed. Please try again.");
    }
  };

  const handleUpdateSubmit = async () => {
    const { title, description, link, lastDate } = updatedData;

    if (!title || !description || !link || !lastDate) {
      showError("All fields are required!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/event/update/${event._id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (onEventUpdated) onEventUpdated();
      setShowUpdateModal(false);
      showSuccess("✅ Event updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      showError("❌ Failed to update event.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/event/delete/${event._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      showSuccess("✅ Event deleted successfully!");
      if (onEventUpdated) onEventUpdated();
    } catch (err) {
      console.error("Delete failed:", err);
      showError("❌ Failed to delete event.");
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center w-[95%] border-4 border-slate-700 p-2 bg-gray-200 rounded-3xl relative">
      <div className="delete-button absolute top-2 right-2">
        {(user?.role === "teacher" || user?.role === "hod") && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-2xl"
          >
            <RiDeleteBin3Fill />
          </button>
        )}
      </div>
      <div className="details flex flex-col gap-2 w-full pl-4 py-4 p-2 rounded-xl text-black">
        <div className="title text-lg">Title - {event.title}</div>
        <div className="description text-sm font-semibold text-blue-900">
          Description - {event.description}
        </div>
        <div className="date text-sm font-semibold text-blue-900">
          Date - {new Date(event.createdAt).toLocaleDateString("en-GB")}
        </div>
        <div className="lastdate text-sm font-semibold text-blue-900">
          Last Date - {new Date(event.lastDate).toLocaleDateString("en-GB")}
        </div>
      </div>

      <div className="participate flex items-center gap-2 justify-around p-2">
        {user?.role === "student" && currentDate <= eventLastDate && (
          <button
            onClick={handleParticipate}
            className="bg-blue-500 hover:scale-105 transition-all duration-200 text-white px-4 py-2 rounded-md text-lg font-medium shadow"
          >
            Participate
          </button>
        )}
        {(user?.role === "teacher" || user?.role === "hod") && (
          <button
            onClick={() => setShowUpdateModal(true)}
            className="bg-blue-500 hover:scale-105 transition-all duration-200 text-white px-4 py-2 rounded-md text-lg font-medium shadow"
          >
            Update
          </button>
        )}
        <button
          onClick={() => onShowParticipants(event.participants, event._id)}
          className="bg-blue-500 hover:scale-105 transition-all duration-200 text-white px-3 py-2 rounded-md text-lg font-medium shadow"
        >
          Show Participants
        </button>
      </div>

      {/* 🔧 Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 backdrop-blur-md  bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl relative shadow-2xl">
            {/* ❌ Close Button */}
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute top-2 right-2 text-red-500 text-3xl"
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
              Update Event
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                value={updatedData.title}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, title: e.target.value })
                }
                placeholder="Event Title"
                className="w-full border px-3 py-2 rounded-md"
              />
              <textarea
                value={updatedData.description}
                onChange={(e) =>
                  setUpdatedData({
                    ...updatedData,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="text"
                value={updatedData.link}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, link: e.target.value })
                }
                placeholder="Form Link"
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="date"
                value={updatedData.lastDate}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, lastDate: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md"
              />
              <button
                onClick={handleUpdateSubmit}
                className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700"
              >
                Submit Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card4;
