// src/App.jsx

import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landingpage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./components/dashboards/DashBoard";
import { useDispatch } from "react-redux";
import { login } from "./redux/auth/authSlice";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import socket from "./socket"; // ✅ socket client import
import axios from "axios";


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      dispatch(login(user));
    }

    // ✅ Socket listener (connect/disconnect)
    socket.on("connect", async () => {
      console.log("✅ Socket connected:", socket.id);

      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          "http://localhost:5000/api/chat/my-conversations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { conversationIds } = res.data;

        // ✅ Join each room
        conversationIds.forEach((id) => {
          console.log("📤 Emitting to room:", id); // Add this for debug
          socket.emit("joinRoom", id);
        });
      } catch (err) {
        console.error("❌ Failed to join rooms", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/student/dashboard" element={<Dashboard />} />
      <Route path="/teacher/dashboard" element={<Dashboard />} />
      <Route path="/hod/dashboard" element={<Dashboard />} />
      <Route path="/librarian/dashboard" element={<Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:role/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default App;
