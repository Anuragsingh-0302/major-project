// src/pages/ResetPassword.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const { role, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password || !confirm) return toast.error("Saare field bhar bhai");
    if (password !== confirm) return toast.error("Password match nahi kar raha");

    setLoading(true);
    try {
      let url =
        role === "student"
          ? `http://localhost:5000/api/auth/student-reset-password/${token}`
          : `http://localhost:5000/api/teacher/reset-password/${token}`;

      await axios.post(url, { password });

      toast.success("Password reset ho gaya! ab login kar");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Token expire ho gaya ya galat hai");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300 px-4">
      <motion.form
        onSubmit={handleReset}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white rounded-lg shadow-md p-10"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-full border border-gray-300 p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-full border border-gray-300 p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-black text-white font-semibold py-3 rounded-full text-xl hover:bg-gray-800 transition"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ResetPassword;
