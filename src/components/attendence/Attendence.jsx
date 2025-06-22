// src/components/attendence/Attendence.jsx

import React, { useState } from "react";
import axios from "axios";

const Attendence = () => {
  const [view, setView] = useState("take");

  const [studentClass, setStudentClass] = useState("");
  const [year, setYear] = useState("");

  const [students, setStudents] = useState([]);
  const [presentMap, setPresentMap] = useState({});

  const [date, setDate] = useState("");
  const [displayData, setDisplayData] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // ---- TAKE ATTENDANCE ----
  const handleFetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/filter", {
        params: { class: studentClass, year },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const fetched = res.data.students || [];
      setStudents(fetched);

      const initialStatus = {};
      fetched.forEach((s) => {
        initialStatus[s._id] = false;
      });
      setPresentMap(initialStatus);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  const toggleStatus = (id) => {
    setPresentMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitAttendance = async () => {
    const presentStudents = Object.keys(presentMap).filter(
      (id) => presentMap[id]
    );

    try {
      await axios.post(
        "http://localhost:5000/api/attendance/take",
        {
          class: studentClass,
          year,
          presentStudents,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Attendance submitted successfully!");
      setStudents([]);
      setPresentMap({});
    } catch (err) {
      console.error("Failed to submit attendance:", err);
    }
  };

  // ---- DISPLAY ATTENDANCE ----
  const handleDisplayAttendance = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/attendance/display",
        {
          params: {
            className: studentClass, // ✅ Fix: use 'className' to match backend schema
            year,
            date,
            teacherId: user.id, // ✅ optional override by HOD
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setDisplayData(res.data.attendance.students || []);
    } catch (err) {
      console.error("Failed to display attendance:", err);
      setDisplayData([]);
    }
  };

  const handleExportAttendance = async () => {
    try {
      const params = new URLSearchParams({
        className: studentClass,
        year,
        date,
        teacherId: user.id, // fallback to user.id
      });

      const response = await fetch(
        `http://localhost:5000/api/attendance/export?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to export");

      // Convert response to blob and download
      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      const match = disposition && disposition.match(/filename="(.+)"/);
      const filename = match
        ? match[1]
        : `attendance_${studentClass}_${date}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to export attendance:", err);
      alert("Export failed");
    }
  };

  const handleClearDisplay = () => {
    setStudentClass("");
    setYear("");
    setDate("");
    setDisplayData([]);
  };

  return (
    <div className="Attendence flex flex-col items-center w-full min-h-[90vh] bg-gray-100">
      {/* Navbar */}
      <div className="navbar w-full flex py-3 px-4 bg-slate-700 text-white items-center">
        <div
          className={`w-1/2 text-center cursor-pointer ${
            view === "take" ? "text-yellow-200" : ""
          }`}
          onClick={() => setView("take")}
        >
          Take Attendance
        </div>
        <div
          className={`w-1/2 text-center cursor-pointer ${
            view === "display" ? "text-yellow-300" : ""
          }`}
          onClick={() => setView("display")}
        >
          Display Attendance
        </div>
      </div>

      {/* TAKE ATTENDANCE */}
      {view === "take" && (
        <>
          <div className="filter w-full flex items-center flex-col">
            <div className="w-full gap-2 pt-2 flex items-center">
              <input
                type="text"
                placeholder="Enter class"
                className="input-style border w-1/2 text-center"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter year of admission"
                className="input-style border w-1/2 text-center"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="w-full flex justify-around my-1.5">
              <button
                onClick={handleFetchStudents}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Apply Filter
              </button>
              <button
                onClick={handleSubmitAttendance}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Attendance
              </button>
            </div>
          </div>

          <div className="viewlist w-full flex flex-col">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded shadow p-3 m-2 flex justify-between items-center"
              >
                <div>{student.enrollment}</div>
                <div>{student.name}</div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={presentMap[student._id]}
                    onChange={() => toggleStatus(student._id)}
                  />
                  <span className="ml-2">
                    {presentMap[student._id] ? "Present" : "Absent"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* DISPLAY ATTENDANCE */}
      {view === "display" && (
        <>
          <div className="filter w-full flex flex-col items-center">
            <div className="w-full flex gap-2 pt-2 items-center">
              <input
                type="text"
                placeholder="Enter Class"
                className="input-style border w-1/2 text-center"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Year of Admission"
                className="input-style border w-1/2 text-center"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="w-full flex gap-2 pt-2 items-center">
              <input
                type="date"
                className="input-style border w-1/2 text-center"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="w-full flex  justify-around my-2">
              <button
                onClick={handleDisplayAttendance}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Display
              </button>
              <button
                onClick={handleClearDisplay}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear
              </button>
              <button
                onClick={handleExportAttendance}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Export to Excel
              </button>
            </div>
          </div>

          <div className="viewlist w-full flex flex-col">
            {displayData.map((entry, index) => (
              <div
                key={index}
                className="bg-white rounded shadow p-3 m-2 flex justify-between items-center"
              >
                <div>{entry.enrollment}</div>
                <div>{entry.studentName}</div>
                <div
                  className={`font-bold ${
                    entry.status === "Present"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {entry.status}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Attendence;
