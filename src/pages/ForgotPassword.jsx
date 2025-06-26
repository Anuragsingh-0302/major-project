// src/pages/ForgotPassword.jsx

import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import { showSuccess, showError } from "../utils/toastUtils.js";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email daal bhai.");

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/student-forgot-password", { email });
      showSuccess("Reset link sent to your gmail! Please Check ✉️");
    } catch (err1) {
      try {
        await axios.post("http://localhost:5000/api/teacher/forgot-password", { email });
        showSuccess("Reset link sent to your gmail! Please Check ✉️");
      } catch (err2) {
        console.error(err2);
        showError("Error in forgot password");
      }
      console.log("Error in forgot password:", err1);
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>DeptHub - Forgot Password</title>
        <meta name="description" content="Reset your DeptHub account password securely via email." />
      </Helmet>

      <div className="flex items-center justify-center min-h-screen bg-gray-300 px-4">
        <motion.form
          onSubmit={handleSend}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full bg-white rounded-lg shadow-md p-10"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Forgot Password?
          </h1>

          <p className="text-center text-gray-600 mb-4">
            Registered email daalo, reset link milega.
          </p>

          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Sending..." : "Send Reset Link"}
          </motion.button>

          <div className="mt-6 text-center text-gray-600">
            Yaad aa gaya?{" "}
            <Link to="/login" className="text-yellow-500 font-semibold hover:underline">
              Login kare
            </Link>
          </div>
        </motion.form>
      </div>
    </>
  );
};

export default ForgotPassword;
