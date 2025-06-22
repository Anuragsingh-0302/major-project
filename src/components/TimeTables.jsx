// src/components/TimeTables.jsx


import React, { useState , useEffect } from "react";
import { BiAlarmAdd } from "react-icons/bi";
import ClassTimeTable from "./timetables/ClassTimeTable";
import ExamTimeTable from "./timetables/ExamTimeTable";
import TimeTableFormModal from "./timetables/TimeTableFormModal";

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
    <div className="timetables w-full min-h-[90vh] relative">
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

      <div className="timetablesbody w-full">
        {activeComponent === "Class Time Tables" && (
          <ClassTimeTable key={refreshKey} />
        )}
        {activeComponent === "Exam Time Tables" && (
          <ExamTimeTable key={refreshKey} />
        )}
      </div>

      {user?.role === "hod" && (
        <div className="addtimetable fixed bottom-8 right-4">
          <button
            className="p-4 rounded-full bg-blue-600 text-white text-4xl"
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
    </div>
  );
};

export default TimeTables;
