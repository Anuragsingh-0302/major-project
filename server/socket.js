// server/socket.js

import { Server } from "socket.io";

let io;

export const initIO = (serverInstance) => {
  io = new Server(serverInstance, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

