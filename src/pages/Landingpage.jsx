// src/pages/landingpage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { showSuccess } from "../utils/toastUtils";
import { useEffect } from "react";


const LandingPage = () => {

  useEffect(() => {
    document.title = "DeptHub - Landing Page";
    showSuccess("Welcome to DeptHub! Please Sign Up or Log In to continue.");
  }, []);

  return (
    <div className="landingpage flex min-h-screen w-full">
      {/* LEFT SECTION - Logo + Intro */}
        
      <div className="intro w-1/2 flex gap-4 flex-col items-end px-[5vw] justify-center bg-white">
        <div className="font-bold text-[50px]">
          <span className="text-black">Dept</span>
          <span className="text-yellow-400 italic">Hub</span>
        </div>
        <p className="text-[20px] font-semibold text-end ">
          Connect with your mates and teachers effortlessly in a clean, modern
          platform designed to foster collaboration, enhance learning, and build
          lasting educational relationships in an elegant, user-friendly
          environment.
        </p>
      </div>

      {/* RIGHT SECTION - Buttons or Pages */}
      <div className="fill w-1/2 flex flex-col px-[5vw] gap-8 justify-center items-start bg-slate-700">
        <Link
          to="/login"
          className="btn w-[60%] text-center rounded-4xl px-[20px] py-4 text-3xl font-semibold shadow-2xl text-black bg-yellow-500 hover:bg-yellow-600 hover:scale-102 "
        >
          <button>Log In</button>
        </Link>
        <Link
          to="/signup"
          className="btn w-[60%] text-center rounded-4xl px-[20px] py-4 text-3xl font-semibold shadow-2xl text-white bg-black hover:bg-gray-800 hover:scale-102 "
        >
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
