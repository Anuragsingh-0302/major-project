// src/pages/Signup.jsx


// src/pages/Signup.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { SiHomeadvisor } from "react-icons/si";
import { showSuccess, showError } from "../utils/toastUtils.js";
import { motion } from "framer-motion";

const Signup = () => {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "DeptHub - Sign Up";
    showSuccess("Please SignUp First.");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!id || !username || !password || !profileImage) {
      setError("Please fill in all fields and upload a profile photo.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    if (role === "student") {
      formData.append("enrollment", id);
    } else {
      formData.append("teacherId", id);
    }

    formData.append("username", username);
    formData.append("password", password);
    formData.append("profileImage", profileImage);

    try {
      let response = await axios.post(
        "http://localhost:5000/api/auth/student-signup",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        navigate("/login");
      } else {
        setError("Signup failed. Please check your ID and try again.");
      }
    } catch (error) {
      try {
        let response = await axios.post(
          "http://localhost:5000/api/teacher/signup",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.data.success) {
          navigate("/login");
        } else {
          setError("Signup failed. Please check your ID and try again.");
        }
      } catch (error) {
        console.log("Error signing up:", error);
        setError("Signup failed. Please check your ID and try again.");
        showError("Signup failed. Please check your ID and try again.");
      }
      console.log("Error signing up:", error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen backdrop-blur-md bg-slate-700 py-[100px] md:py-0">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full bg-white rounded-lg shadow-md p-10"
        aria-label="Signup form"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Sign Up
        </h1>

        {error && (
          <p
            role="alert"
            className="mb-4 text-red-600 text-center font-semibold"
          >
            {error}
          </p>
        )}

        {/* Role field */}
        <label className="block mb-2 text-gray-700 font-medium" htmlFor="role">
          You are signing up as
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-full border border-gray-300 p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-black"
          required
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="hod">HOD</option>
          <option value="librarian">Librarian</option>
        </select>

        {/* ID Field */}
        <label className="block mb-2 text-gray-700 font-medium" htmlFor="id">
          {role === "student"
            ? "Enrollment"
            : role === "teacher" || role === "hod" || role === "librarian"
            ? "Teacher ID"
            : "ID (Enrollment or Teacher ID)"}
        </label>
        <input
          id="id"
          type="text"
          className="w-full rounded-full border border-gray-300 p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />

        {/* Username */}
        <label
          className="block mb-2 text-gray-700 font-medium"
          htmlFor="username"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          className="w-full rounded-full border border-gray-300 p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Create a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Password */}
        <label
          className="block mb-2 text-gray-700 font-medium"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full rounded-full border border-gray-300 p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Profile Photo */}
        <label
          className="block mb-2 text-gray-700 font-medium"
          htmlFor="profileImage"
        >
          Profile Photo
        </label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          className="w-full rounded-full border border-gray-300 p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-black"
          onChange={(e) => setProfileImage(e.target.files[0])}
          required
        />

        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-semibold py-3 rounded-full text-xl hover:bg-gray-800 transition"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </motion.button>

        {/* Already have account */}
        <div className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-500 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            Log In
          </Link>
        </div>
      </motion.form>

      {/* Home icon */}
      <Link
        to="/"
        className="absolute top-5 left-5 transition-all hover:scale-110"
      >
        <SiHomeadvisor size={50} color="white" />
      </Link>
    </div>
  );
};

export default Signup;
