// src/components/CreateEventModal.jsx

import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { showSuccess , showError } from "../utils/toastUtils";

const CreateEventModal = ({ onClose, onEventCreated }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.post("http://localhost:5000/api/event/create", data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.data.success) {
        showSuccess("✅ Event created successfully!");
        reset();           // ✅ clear form
        onEventCreated();  // ✅ refresh events
        onClose();         // ✅ close modal
      } else {
        showError("❌ Failed to create event. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      showError("❌ An error occurred while creating the event. Please check your input and try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-center">Create Event</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Event ID"
            {...register("eventId", { required: true })}
            className="border px-3 py-2 rounded"
          />
          {errors.eventId && <p className="text-red-500 text-sm">Event ID is required</p>}

          <input
            type="text"
            placeholder="Title"
            {...register("title", { required: true })}
            className="border px-3 py-2 rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">Title is required</p>}

          <textarea
            placeholder="Description"
            {...register("description", {
              required: true,
              maxLength: 200,
            })}
            className="border px-3 py-2 rounded"
          />
          {errors.description?.type === "required" && (
            <p className="text-red-500 text-sm">Description is required</p>
          )}
          {errors.description?.type === "maxLength" && (
            <p className="text-red-500 text-sm">Description must be under 200 characters</p>
          )}

          <input
            type="text"
            placeholder="Google Form Link"
            {...register("link", { required: true })}
            className="border px-3 py-2 rounded"
          />
          {errors.link && <p className="text-red-500 text-sm">Link is required</p>}

          <input
            type="date"
            {...register("lastDate", { required: true })}
            className="border px-3 py-2 rounded"
          />
          {errors.lastDate && <p className="text-red-500 text-sm">Date is required</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="text-red-500 font-semibold">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
