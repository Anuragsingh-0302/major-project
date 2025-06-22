// src/components/navbar.jsx
import React from "react";
import { useSelector } from "react-redux";
import defaultMale from "../images/male.png";
import defaultFemale from "../images/female.png";
import logo from "../images/logo.jpg";

const Navbar = () => {
  const userProfile = useSelector((state) => state.auth.userProfile);
  const name = userProfile?.name || userProfile?.username || "User";
  const gender = userProfile?.gender || "male";
  const profileImage = userProfile?.profileImage
    ? `http://localhost:5000${userProfile.profileImage}`
    : gender === "female"
    ? defaultFemale
    : defaultMale;

  return (
    <div className="w-full h-[70px] px-6 bg-slate-500 border-b shadow-sm flex items-center justify-between sticky top-0 z-50">
      {/* Left Logo */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="logo" className="w-[40px] h-[40px] rounded-full shadow-sm border-2" />
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-black">Dept</span>
          <span className="italic text-yellow-400">Hub</span>
        </h1>
      </div>

      {/* Center Role Info */}
      <div className="text-lg  text-white font-bold tracking-wide uppercase">
        {userProfile?.role} Dashboard
      </div>

      {/* Right Profile */}
      <div className="flex items-center gap-4">
        <span className="text-md font-semibold text-white ">{name}</span>
        <img
          src={profileImage}
          alt="User Profile"
          className="w-[40px] h-[40px] rounded-full border-2 border-black object-cover shadow-md transition-transform duration-200 hover:scale-105"
        />
      </div>
    </div>
  );
};

export default Navbar;
