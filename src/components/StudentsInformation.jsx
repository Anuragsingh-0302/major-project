// src/components/StudentsInformation.jsx

import React, { useState , useEffect } from "react";
import axios from "axios";
import Card7 from "./Card7";

const StudentsInformation = () => {
  const [className, setClassName] = useState("");
  const [yearOfAdmission, setYearOfAdmission] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    document.title = "DeptHub - Students Information";
    handleFetch();
  }, []);

  const handleFetch = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      const res = await axios.get("http://localhost:5000/api/role/students", {
        params: { className, yearOfAdmission },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(res.data.students);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleStudentUpdate = (updatedStudent) => {
    setStudents((prev) =>
      prev
        .filter((stu) => stu._id !== updatedStudent._id)
        .concat(
          updatedStudent.class === className &&
            String(updatedStudent.yearOfAdmission) === yearOfAdmission
            ? updatedStudent
            : []
        )
    );
  };

  const handleStudentDeleted = (id) => {
    setStudents((prev) => prev.filter((stu) => stu._id !== id));
  };

  return (
    <div className="w-full min-h-[95vh] bg-gray-100 flex flex-col items-center">
      {/* Filter */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 bg-slate-700">
        <select
          name="className"
          required
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-md bg-white border border-gray-300 focus:outline-none"
        >
          <option value="">Select Class</option>
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
        </select>
        <input
          type="text"
          name="yearOfAdmission"
          value={yearOfAdmission}
          onChange={(e) => setYearOfAdmission(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-md bg-white border border-gray-300 focus:outline-none"
          placeholder="Year of Admission"
        />
        <button
          onClick={handleFetch}
          className="w-full md:w-1/4 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-all"
        >
          Display
        </button>
      </div>

      {/* Info message */}
      <div className="w-full text-center text-gray-600 text-sm py-2">
        Total Students: {students.length} {className && `of Class ${className}`}{" "}
        {yearOfAdmission && `Year ${yearOfAdmission}`}
      </div>

      {/* Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {students.map((stu) => (
          <Card7
            key={stu._id}
            student={stu}
            onStudentUpdated={handleStudentUpdate}
            onStudentDeleted={handleStudentDeleted} // ✅ Pass the new handler here
          />
        ))}
      </div>
    </div>
  );
};

export default StudentsInformation;
