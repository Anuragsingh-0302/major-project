// src/components/TimeTables.jsx

import React, { useState, useEffect } from "react";
import { BiAlarmAdd } from "react-icons/bi";
import ClassTimeTable from "./timetables/ClassTimeTable";
import ExamTimeTable from "./timetables/ExamTimeTable";
import TimeTableFormModal from "./timetables/TimeTableFormModal";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const TimeTables = () => {
  const [activeComponent, setActiveComponent] = useState("Class Time Tables");
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // for triggering re-fetch

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    document.title = "DeptHub - Time Tables";
  }, []);

  const handleComponentChange = (componentName) => {
    setActiveComponent(componentName);
  };

  const handleUpload = () => {
    setRefreshKey((prev) => prev + 1); // change key to re-render
  };

  return (
    <>
      <Helmet>
        <title>Time Tables - DeptHub</title>
      </Helmet>

      <motion.div
        className="timetables w-full min-h-[90vh] relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="timetablesnav flex justify-between p-3 bg-slate-700 text-white">
          <div
            className={`text-center w-1/2 cursor-pointer border-r ${
              activeComponent === "Class Time Tables" && "font-bold"
            }`}
            onClick={() => handleComponentChange("Class Time Tables")}
          >
            Class Time Table
          </div>
          <div
            className={`text-center w-1/2 cursor-pointer border-l ${
              activeComponent === "Exam Time Tables" && "font-bold"
            }`}
            onClick={() => handleComponentChange("Exam Time Tables")}
          >
            Exam Time Table
          </div>
        </div>

        <div className="timetablesbody w-full  p-2">
          {activeComponent === "Class Time Tables" && (
            <ClassTimeTable key={refreshKey} />
          )}
          {activeComponent === "Exam Time Tables" && (
            <ExamTimeTable key={refreshKey} />
          )}
        </div>

        {user?.role === "hod" && (
          <div className="addtimetable fixed bottom-15 right-8">
            <button
              className="p-2 rounded-full bg-blue-600 text-white text-4xl"
              onClick={() => setShowModal(true)}
            >
              <BiAlarmAdd />
            </button>
          </div>
        )}

        {showModal && (
          <TimeTableFormModal
            onClose={() => setShowModal(false)}
            onUpload={handleUpload}
          />
        )}
      </motion.div>
    </>
  );
};

export default TimeTables;
