// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true,
});

// ✅ Custom message listener
export const listenToMessages = (callback) => {
  socket.on("receiveMessage", callback);
};

// ✅ Stop message listener (cleanup)
export const stopListening = () => {
  socket.off("receiveMessage");
};

export default socket;
