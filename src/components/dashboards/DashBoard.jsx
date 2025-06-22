// src/components/dashboards/dashboard.jsx

import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import defaultMale from "../../images/male.png";
import defaultFemale from "../../images/female.png";
import { TbLogout } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import MyProfile from "../Myprofile";
import TeachersProfile from "../TeachersProfile";
import HODProfile from "../HODProfile";
import MyMates from "../MyMates";
import Events from "../Events";
import TimeTables from "../TimeTables";
import StudentRegisterForm from "../StudentRegisterForm";
import TeacherRegisterForm from "../TeacherRegisterForm";
import StudentsInformation from "../StudentsInformation";
import Library from "../library/Library";
import Attendence from "../attendence/Attendence";
import { showSuccess } from "../../utils/toastUtils";
import { BsFillPersonVcardFill } from "react-icons/bs";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("My Profile");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userProfile = useSelector((state) => state.auth.userProfile);
  const role = userProfile?.role || "";
  const gender = userProfile?.gender || "male";
  const uname = userProfile?.name || userProfile?.username || "";
  const profileImage = userProfile?.profileImage
    ? `http://localhost:5000${userProfile.profileImage}`
    : gender === "female"
    ? defaultFemale
    : defaultMale;

  useEffect(() => {
    document.title = `DeptHub - ${uname} Dashboard`;
    showSuccess(`Welcome ${uname}!`);
  }, [uname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("myprofile");
    dispatch(logout());
    navigate("/login");
    showSuccess("Logout successful!");
    window.location.reload();
  };

  useEffect(() => {
    const profileData = JSON.parse(localStorage.getItem("myprofile"));
    if (!profileData) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const sidebarOptions = {
    student: [
      "My Profile",
      "HOD Profile",
      "Teachers Profile",
      "My Mates",
      "Events",
      "TimeTables",
    ],
    teacher: [
      "My Profile",
      "HOD Profile",
      "Students",
      "Register New Student",
      "Events",
      "Attendance",
      "TimeTables",
    ],
    hod: [
      "My Profile",
      "Teachers Profile",
      "Students",
      "Register New Student",
      "Register New Teacher",
      "Events",
      "TimeTables",
      "Attendance",
    ],
    librarian: [
      "My Profile",
      "HOD Profile",
      "Teachers Profile",
      "Students",
      "Library",
    ],
  };

  return (
    <div className="dashboard min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex min-h-[calc(100vh-112px)]">
        <aside className="sidebar w-64 bg-slate-700 text-white shadow-lg border-r flex flex-col items-center py-6">
          <div className="mb-6 flex flex-col items-center">
            <img
              src={profileImage}
              className="w-[90px] h-[90px] rounded-full object-cover border-4 border-amber-300"
              alt="Profile"
            />
            <h2 className="mt-3 text-lg font-semibold text-white">{uname}</h2>
            <p className="text-sm text-gray-300">{role.toUpperCase()}</p>
          </div>

          <nav className="w-full px-4 flex-1">
            {(sidebarOptions[role] || []).map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveComponent(item)}
                className={`w-full py-3 px-4 mb-2 rounded-lg font-medium cursor-pointer text-left transition-all ${
                  activeComponent === item
                    ? "bg-[#505081] text-yellow-300"
                    : "text-white hover:bg-slate-600"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>

          <div className="w-full px-4 mt-auto" onClick={handleLogout}>
            <div className="flex items-center justify-between text-red-600 font-semibold py-3 px-4 rounded-lg hover:bg-red-50 cursor-pointer border border-red-200 transition-all">
              <span>Logout</span>
              <TbLogout size={20} />
            </div>
          </div>
        </aside>

        <main className="flex-1 p-2 bg-white relative">
          {activeComponent === "My Profile" && <MyProfile />}
          {activeComponent === "HOD Profile" && <HODProfile />}
          {activeComponent === "Teachers Profile" && <TeachersProfile />}
          {activeComponent === "My Mates" && <MyMates />}
          {activeComponent === "Events" && <Events />}
          {activeComponent === "TimeTables" && <TimeTables />}
          {activeComponent === "Students" && <StudentsInformation />}
          {activeComponent === "Register New Student" && (
            <StudentRegisterForm />
          )}
          {activeComponent === "Register New Teacher" && <TeacherRegisterForm />}
          {activeComponent === "Attendance" && <Attendence />}
          {activeComponent === "Library" && <Library />}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
