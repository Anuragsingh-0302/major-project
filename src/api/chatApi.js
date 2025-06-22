// src/api/chatApi.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/chat`
  : "http://localhost:5000/api/chat";

const token = localStorage.getItem("token");

// ✅ Fetch conversation + messages
export const fetchMessages = async (currentUser, receiver) => {
  const res = await axios.post(
    `${BASE_URL}/conversation`,
    {
      recipientId: receiver._id,
      recipientRole: receiver.role,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );

  const { conversation } = res.data;

  const messages = await axios.get(`${BASE_URL}/messages/${conversation._id}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

  return {
    data: {
      messages: messages.data.messages,
      conversationId: conversation._id,
    },
  };
};

// ✅ Send message
export const sendMessage = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(`${BASE_URL}/message`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return { data: res.data.message };
};
