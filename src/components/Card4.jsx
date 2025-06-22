import React from "react";
import axios from "axios";
import {  showError } from "../utils/toastUtils";

const Card4 = ({ event, user, onShowParticipants,onEventUpdated }) => {
  const currentDate = new Date();
  const eventLastDate = new Date(event.lastDate);

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

      // ✅ UI refresh immediately
    if (onEventUpdated) onEventUpdated();

      window.open(link, "_blank"); // redirect after API success
    } catch (err) {
      console.error("Participation failed:", err);
      showError("❌ Participation failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center w-[80%] border-4 border-slate-400 p-2 bg-gray-200 rounded-3xl">
      <div className="details flex flex-col gap-2 w-full pl-4 py-4 p-2 rounded-xl  text-black ">
        <div className="title text-lg">Title - {event.title}</div>
        <div className="description text-sm font-semibold font-sans text-blue-900 ">Description - {event.description}</div>
        <div className="date text-sm font-semibold font-sans text-blue-900  ">
          Date - {new Date(event.createdAt).toLocaleDateString("en-GB")}
        </div>
        <div className="lastdate text-sm font-semibold font-sans text-blue-900  ">
          Last Date - {new Date(event.lastDate).toLocaleDateString("en-GB")}
        </div>
      </div>

      <div className="participate flex items-center gap-2 justify-around p-2">
        {user?.role === "student" && currentDate <= eventLastDate && (
          <button
            onClick={handleParticipate}
            className="bg-blue-500 hover:scale-105 transition-all duration-200 text-white px-4 py-3 rounded-md text-lg font-medium shadow"
          >
            Participate
          </button>
        )}

        <button
          onClick={() => onShowParticipants(event.participants, event._id)}
          className="bg-blue-500 hover:scale-105 transition-all duration-200 text-white px-3 py-2 rounded-md  text-lg font-medium shadow"
        >
          Show Participants
        </button>
      </div>
    </div>
  );
};

export default Card4;
