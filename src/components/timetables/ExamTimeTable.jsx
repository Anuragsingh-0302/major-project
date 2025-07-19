// src/components/timetables/ExamTimeTable.jsx

// src/components/timetables/ExamTimeTable.jsx

import React, { useEffect, useState } from "react";
import Card6 from "../cards/Card6";

const ExamTimeTable = () => {
  const [examTimetables, setExamTimetables] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const isHOD = user?.role === "hod";

  useEffect(() => {
    const fetchExamTimetables = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/timetable/display?type=exam");
        const data = await res.json();
        if (data.success) {
          setExamTimetables(data.timeTables);
        }
      } catch (err) {
        console.error("Error fetching exam timetables:", err);
      }
    };

    fetchExamTimetables();
  }, []);

  return (
    <div className="examTimetables grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 bg-slate-300">
      {examTimetables.length > 0 ? (
        examTimetables.map((item) => (
          <Card6 key={item._id} data={item} isHOD={isHOD} />
        ))
      ) : (
        <p className="text-center col-span-3">No exam time tables available.</p>
      )}
    </div>
  );
};

export default ExamTimeTable;
