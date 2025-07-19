// src/components/chat/MyConversations.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import Card11 from "../cards/Card11";
import ChatModal from "./ChatModal";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const MyConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    document.title = "DeptHub - My Chats";
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/chat/my-conversations",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const allConversations = res.data.conversations || [];

        const formatted = allConversations
          .map((conv) => {
            const other = conv.participants.find(
              (p) => p.user._id !== user._id
            );

            if (!other || !other.user) return null;

            return {
              _id: conv._id,
              participant: other.user,
              role: other.role,
            };
          })
          .filter(Boolean)
          .reverse();

        setConversations(formatted);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    fetchConversations();
  }, [user.token, user._id]);

  const handleChatClick = (receiverData) => {
    setReceiver(receiverData);
    setShowChat(true);
  };

  return (
    <>
      <Helmet>
        <title>My Chats - DeptHub</title>
      </Helmet>

      <motion.div
        className="w-full min-h-[90vh] p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-bold text-blue-600 mb-2">My Chats</h2>
        <p className="text-gray-500 text-sm mb-4">
          Here are all your previous conversations
        </p>

        {conversations.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No conversations found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {conversations.map((conv) => (
              <Card11
                key={conv._id}
                user={conv.participant}
                role={conv.role}
                onChatClick={() =>
                  handleChatClick({
                    _id: conv.participant._id,
                    name: conv.participant.name,
                    role: conv.role,
                    enrollment: conv.participant.enrollment,
                    teacherId: conv.participant.teacherId,
                    profileImage: conv.participant.profileImage,
                  })
                }
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Chat box modal remains as is */}
      {showChat && receiver && (
        <ChatModal
          receiver={receiver}
          currentUser={user}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
};

export default MyConversations;
