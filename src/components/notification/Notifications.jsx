// src/components/notification/Notifications.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import Card10 from "../cards/Card10";
import AddNotificationModal from "../modals/AddNotificationModal";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { MdOutlinePlaylistAdd } from "react-icons/md";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userRole, setUserRole] = useState("");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications");
      if (res.data?.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    document.title = "DeptHub - Notifications";
    fetchNotifications();

    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored?.role) {
      setUserRole(stored.role.toLowerCase());
    }
  }, []);

  const handleNotificationAdded = (newNotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const handleNotificationUpdated = (updated) => {
    setNotifications((prev) =>
      prev.map((item) => (item._id === updated._id ? updated : item))
    );
  };

  const handleNotificationDeleted = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <>
      <Helmet>
        <title>Notifications - DeptHub</title>
      </Helmet>

      <motion.div
        className="min-h-[90vh] w-full bg-gray-100 px-4 py-6 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Top Heading */}
        <div className="text-xl font-semibold text-gray-800 mb-6 text-center">
          You have {notifications.length} notifications
        </div>

        {/* Notification Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.map((n) => (
            <Card10
              key={n._id}
              notification={n}
              onUpdated={handleNotificationUpdated}
              onDeleted={handleNotificationDeleted}
            />
          ))}
        </div>

        {/* Add Button (only for non-students) */}
        {userRole !== "student" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="fixed bottom-15 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg flex gap-2 items-center hover:bg-blue-700 transition-all"
          >
           <MdOutlinePlaylistAdd size={24} />Add Notification
          </button>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <AddNotificationModal
            onClose={() => setShowAddModal(false)}
            onCreated={handleNotificationAdded}
          />
        )}
      </motion.div>
    </>
  );
};

export default Notifications;
