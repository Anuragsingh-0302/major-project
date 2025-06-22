// src/pages/Login.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiHomeadvisor } from "react-icons/si";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../redux/auth/authSlice";
import { toast } from "react-toastify";
import { showSuccess } from "../utils/toastUtils.js";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "DeptHub - Login";

    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      toast.info("You are already logged in!");
      navigate(`/${user.role}/dashboard`);
    }
  }, [navigate]);

  useEffect(() => {
    showSuccess("Please login to continue.");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);

    try {
      // Try student login
      let response = await axios.post(
        "http://localhost:5000/api/auth/student-login",
        { loginId: username, password },
        {
          withCredentials: true, // 🔥 This allows cookie to be sent/stored
        }
      );
      const { student } = response.data;
      const finalUser = {
        ...student,
        _id: student.id,
        token: response.data.token,
      };
      localStorage.setItem("user", JSON.stringify(finalUser));
      dispatch(loginAction(finalUser));
      showSuccess("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      try {
        // Try teacher/hod/librarian login
        let response = await axios.post(
          "http://localhost:5000/api/teacher/login",
          { loginId: username, password },
          {
            withCredentials: true,
          }
        );
        const { teacher } = response.data;
        const finalUser = {
          ...teacher,
          _id: teacher.id,
          token: response.data.token,
        };
        localStorage.setItem("user", JSON.stringify(finalUser));
        dispatch(loginAction(finalUser));
        toast.success("Login successful!");
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
        toast.error("Invalid credentials. Please try again.");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full bg-white rounded-lg shadow-md p-10"
        aria-label="Login form"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Login
        </h1>

        <label
          className="block mb-2 text-gray-700 font-medium"
          htmlFor="username"
        >
          Username, Email or ID
        </label>
        <input
          id="username"
          type="text"
          className="w-full rounded-full border border-gray-300 p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-semibold py-3 rounded-full text-xl hover:bg-gray-800 transition"
        >
          {loading ? "Logging In..." : "Login"}
        </button>
        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-yellow-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-500 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </form>
      <Link
        to="/"
        className="absolute top-5 left-5 transition-all hover:scale-110"
      >
        <SiHomeadvisor size={50} color="black" />
      </Link>
    </div>
  );
};

export default Login;
