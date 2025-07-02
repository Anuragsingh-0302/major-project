// src/components/Events.jsx

import React, { useEffect, useState } from "react";
import Card4 from "./Card4";
import Card5 from "./Card5";
import CreateEventModal from "./CreateEventModal";
import axios from "axios";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { FaDeleteLeft } from "react-icons/fa6";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [showParticipantsForEventId, setShowParticipantsForEventId] =
    useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

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

  const handleShowParticipants = async (participants, eventId) => {
    setShowParticipantsForEventId(eventId);
    setShowDialog(true);

    try {
      const updatedParticipants = await Promise.all(
        participants.map(async (p) => {
          const res = await axios.get(
            `http://localhost:5000/api/student/by-enrollment/${p.enrollment}`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          return res.data.student;
        })
      );
      setSelectedParticipants(updatedParticipants);
    } catch (error) {
      console.error("Error fetching updated participants:", error);
    }
  };

  const handleDeleteParticipant = async (participant, eventId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/event/events/${eventId}/participants/${participant._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

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
    <>
      <Helmet>
        <title>Events - DeptHub</title>
      </Helmet>

      <motion.div
        className="events flex flex-col gap-1 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="eventnavbar w-full flex justify-between items-center p-3 bg-slate-700 text-white font-semibold text-xl">
          <div className="eventslist w-full text-center">Events</div>
        </div>

        <div className="details w-full flex">
          <div className="w-full bg-slate-300 p-2 flex flex-col gap-2 items-center border-2 border-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
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
            </div>

            {(user.role === "teacher" || user.role === "hod") && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-full mt-2 font-semibold"
              >
                Create Event
              </button>
            )}
          </div>
        </div>

        {/* Participants Dialog */}
        {showDialog && (
          <div className="fixed inset-0 flex items-center backdrop-blur-md justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/5 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center  bg-white z-10 pb-2">
                <h2 className="text-xl font-semibold">Participants</h2>
                <button
                  onClick={() => setShowDialog(false)}
                  className="text-red-500 text-2xl"
                >
                  <FaDeleteLeft />
                </button>
              </div>
              <p className="mt-3">
                <b>Event ID: </b>
                {showParticipantsForEventId}
              </p>
              <p className="mt-1">
                <b>Event Title: </b>
                {
                  events.find((e) => e._id === showParticipantsForEventId)
                    ?.title
                }
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {selectedParticipants.map((participant) => (
                  <Card5
                    key={participant._id}
                    participant={participant}
                    userRole={user.role}
                    onDelete={() =>
                      handleDeleteParticipant(
                        participant,
                        showParticipantsForEventId
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <CreateEventModal
            onClose={() => setShowModal(false)}
            onEventCreated={fetchEvents}
          />
        )}
      </motion.div>
    </>
  );
};

export default Events;
