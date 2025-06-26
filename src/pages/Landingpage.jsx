// src/pages/landingpage.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { showSuccess } from "../utils/toastUtils";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [hoveredSide, setHoveredSide] = useState("left");

  useEffect(() => {
    document.title = "DeptHub - Landing Page";
    showSuccess("Welcome to DeptHub! Please Sign Up or Log In to continue.");

    const handleMouseMove = (e) => {
      const half = window.innerWidth / 2;
      setHoveredSide(e.clientX < half ? "left" : "right");
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const logoVariants = {
    initial: { y: -20, opacity: 0 },
    animate: {
      y: [0, -5, 0],
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  return (
    <div
      className={`landingpage flex flex-col sm:flex-row min-h-screen w-full transition-colors duration-500 ${
        hoveredSide === "left" ? "bg-gradient-to-r from-white to-white" : "bg-gradient-to-l from-slate-700 to-gray-700"
      }`}
    >
      {/* LEFT SECTION */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`intro w-full sm:w-1/2 flex gap-6 flex-col sm:items-end items-center px-[5vw] justify-center min-h-[50vh] ${
          hoveredSide === "left" ? "text-black" : "text-white"
        }`}
      >
        {/* Animated Logo */}
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="animate"
          className="font-bold text-[50px] drop-shadow-md"
        >
          <span className="text-black">Dept</span>
          <span className="text-yellow-400 italic">Hub</span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-[20px] font-semibold text-center sm:text-end"
        >
          Connect with your mates and teachers effortlessly in a clean, modern
          platform designed to foster collaboration, enhance learning, and build
          lasting educational relationships in an elegant, user-friendly
          environment.
        </motion.p>
      </motion.div>

      {/* RIGHT SECTION */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fill w-full sm:w-1/2 flex flex-col px-[5vw] gap-8 justify-center lg:items-start items-center min-h-[50vh] ${
          hoveredSide === "right" ? "bg-white backdrop-blur-sm" : "bg-slate-700 backdrop-blur-sm"
        }`}
      >
        <motion.div
          whileHover={{ scale: 1.05}}
          whileTap={{ scale: 0.95 }}
          className="w-[60%]"
        >
          <Link
            to="/login"
            className="btn block text-center rounded-4xl px-[20px] py-4 text-3xl font-semibold shadow-2xl text-black bg-yellow-500 hover:bg-yellow-600 transition duration-300"
          >
            Log In
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255,255,255,0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="w-[60%]"
        >
          <Link
            to="/signup"
            className="btn block text-center rounded-4xl px-[20px] py-4 text-3xl font-semibold shadow-2xl text-white bg-black hover:bg-gray-800 transition duration-300"
          >
            Sign Up
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
