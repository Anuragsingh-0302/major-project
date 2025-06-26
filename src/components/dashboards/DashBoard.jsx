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
import About from "../../pages/About";
import ContactUs from "../../pages/ContactUs";
import Notifications from "../notification/Notifications";
import { motion } from "framer-motion";
import { IoMdCloseCircle } from "react-icons/io";
import { BsFillMenuButtonWideFill } from "react-icons/bs";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("My Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      "TimeTables",
      "Events",
      "About Depthub",
      "Contact Us",
      "Notifications",
    ],
    teacher: [
      "My Profile",
      "HOD Profile",
      "Students",
      "Attendance",
      "TimeTables",
      "Events",
      "Register New Student",
      "About Depthub",
      "Contact Us",
      "Notifications",
    ],
    hod: [
      "My Profile",
      "Teachers Profile",
      "Students",
      "Attendance",
      "TimeTables",
      "Events",
      "Register New Student",
      "Register New Teacher",
      "About Depthub",
      "Contact Us",
      "Notifications",
    ],
    librarian: [
      "My Profile",
      "HOD Profile",
      "Teachers Profile",
      "Students",
      "Library",
      "About Depthub",
      "Contact Us",
      "Notifications",
    ],
  };

  return (
    <div className="dashboard min-h-screen bg-gray-100 overflow-hidden relative">
      {/* Navbar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Navbar />
      </motion.div>

      {/* Menu Icon on Mobile */}

      <div className="flex min-h-[calc(100vh-112px)]">
        {/* Sidebar */}
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.5 }}
            className={`bg-slate-700 text-white shadow-lg border-r flex flex-col items-center py-[50px] pb-[120px] md:py-6 overflow-y-auto z-30 md:static absolute top-0 left-0 h-[110vh] md:h-[calc(100vh-112px)] ${
              isMobile ? "w-[80vw]" : "w-75"
            }`}
          >
            <div className="mb-6 flex flex-col items-center mt-[60px] md:mt-0">
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
                  onClick={() => {
                    setActiveComponent(item);
                    if (isMobile) setIsSidebarOpen(false);
                  }}
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

            {/* Close icon */}
            {isMobile && (
              <div className="absolute top-20 right-5 text-2xl text-white cursor-pointer">
                <IoMdCloseCircle onClick={() => setIsSidebarOpen(false)} />
              </div>
            )}

            <div className="w-full px-4 mt-auto" onClick={handleLogout}>
              <div className="flex items-center justify-between text-red-600 font-semibold py-3 px-4 rounded-lg hover:bg-red-50 cursor-pointer border border-red-200 transition-all">
                <span>Logout</span>
                <TbLogout size={20} />
              </div>
            </div>
          </motion.aside>
        )}

        {/* Main Content */}
        <motion.main
          initial={{ x: 200 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.1 }}
          className={`relative overflow-y-auto transition-all duration-300 flex flex-col ${
            !isMobile && isSidebarOpen ? "w-[calc(100%-17.5rem)]" : "w-screen"
          }`}
          style={{ height: "calc(100vh - 112px)" }}
        >
          {!isSidebarOpen && isMobile && (
            <div className="flex items-center justify-between ">
              <button
                className=" text-3xl text-slate-800 md:hidden pl-4 py-3 z-50"
                onClick={() => setIsSidebarOpen(true)}
              >
                <BsFillMenuButtonWideFill />
              </button>
              <div className="text-lg  sm:hidden text-slate-700 font-bold tracking-wide uppercase pr-4">
                {userProfile?.role} Dashboard
              </div>
            </div>
          )}
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
          {activeComponent === "Register New Teacher" && (
            <TeacherRegisterForm />
          )}
          {activeComponent === "Attendance" && <Attendence />}
          {activeComponent === "Library" && <Library />}
          {activeComponent === "About Depthub" && <About />}
          {activeComponent === "Contact Us" && <ContactUs />}
          {activeComponent === "Notifications" && <Notifications />}
          {/* Mobile Menu Icon */}
        </motion.main>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.2 }}
        className="z-40 relative"
      >
        <Footer />
      </motion.div>
    </div>
  );
};

export default Dashboard;
