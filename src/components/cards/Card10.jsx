//src/components/cards/Card10.jsx

import React, { useState, useEffect } from "react";
import NotificationModal from "../modals/NotificationViewModal";
import { format } from "date-fns";

const Card10 = ({ notification, onUpdated, onDeleted }) => {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState("student");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) setRole(user.role.toLowerCase());
  }, []);

  return (
    <>
      <div className="bg-white w-full rounded-lg shadow-md p-4 flex flex-col justify-between border border-gray-200">
        <div>
          <div className="text-sm text-gray-500 mb-2">
            {format(new Date(notification.date), "dd MMM yyyy")}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {notification.title}
          </h3>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowModal(true)}
            className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            View
          </button>
        </div>
      </div>

      {showModal && (
        <NotificationModal
          notification={notification}
          role={role}
          onClose={() => setShowModal(false)}
          onUpdated={onUpdated}
          onDeleted={onDeleted}
        />
      )}
    </>
  );
};

export default Card10;
