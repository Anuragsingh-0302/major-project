// src/components/Events.jsx

// src/components/Events.jsx

import React, { useEffect, useState } from "react";
import Card4 from "./Card4";
import Card5 from "./Card5";
import CreateEventModal from "./CreateEventModal";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [showParticipantsForEventId, setShowParticipantsForEventId] =
    useState(null);
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    document.title = "DeptHub - Events";
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/event/allevents", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvents(res.data.events);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleShowParticipants = (participants, eventId) => {
    setShowParticipantsForEventId(eventId);
    setSelectedParticipants(participants);
  };

  const handleDeleteParticipant = async (participant, eventId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/event/events/${eventId}/participants/${participant._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      console.log(res.data);

      // UI update
      const updatedEvents = events.map((event) => {
        if (event._id === eventId) {
          return {
            ...event,
            participants: event.participants.filter(
              (p) => p._id !== participant._id
            ),
          };
        }
        return event;
      });

      setEvents(updatedEvents);
      setSelectedParticipants((prev) =>
        prev.filter((p) => p._id !== participant._id)
      );
    } catch (err) {
      console.error("Error deleting participant:", err);
    }
  };

  return (
    <div className="events flex flex-col gap-1 w-[100%]">
      <div className="eventnavbar w-[100%] flex justify-center items-center p-3 rounded-t-2xl bg-slate-700 text-white font-semibold text-xl">
        <div className="eventslist w-1/2 text-center">Events</div>
        <div className="participantslist w-1/2 text-center">Participants</div>
      </div>

      <div className="details w-[100%] flex">
        {/* Events Section */}
        <div className="w-1/2 bg-slate-300 p-2 flex flex-col gap-2 items-center  border-2 border-white">
          {events.map((event) => (
            <Card4
              key={event._id}
              event={event}
              user={user}
              onShowParticipants={handleShowParticipants}
              setEvents={setEvents}
              onEventUpdated={fetchEvents}
            />
          ))}

          {/* HOD/Teacher Create Button */}
          {(user.role === "teacher" || user.role === "hod") && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-full mt-2 font-semibold"
            >
              Create Event
            </button>
          )}
        </div>

        {/* Participants Section */}
        <div className="w-1/2 bg-slate-300 p-2 py-4 flex flex-col gap-2  border-2 border-white">
          {selectedParticipants.map((participant, index) => (
            <Card5
              key={index}
              participant={participant}
              userRole={user.role}
              title={
                events.find((e) => e._id === showParticipantsForEventId)?.title
              }
              eventId={
                events.find((e) => e._id === showParticipantsForEventId)
                  ?.eventId
              }
              onDelete={() =>
                handleDeleteParticipant(participant, showParticipantsForEventId)
              }
            />
          ))}
        </div>
      </div>

      {/* Modal for Create Event */}
      {showModal && (
        <CreateEventModal
          setShowModal={setShowModal}
          setEvents={setEvents}
          user={user}
          onEventCreated={fetchEvents} // ✅ Add this line
        />
      )}
    </div>
  );
};

export default Events;
