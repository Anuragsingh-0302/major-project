// src/components/timetables/ClassTimeTable.jsx

// src/components/timetables/ClassTimeTable.jsx

import React, { useEffect, useState } from "react";
import Card6 from "../Card6";

const ClassTimeTable = () => {
  const [classTimetables, setClassTimetables] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const isHOD = user?.role === "hod";

  useEffect(() => {
    const fetchClassTimetables = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/timetable/display");
        console.log(res.data);
        
        const data = await res.json();
        if (data.success) {
          setClassTimetables(data.timeTables);
          console.log("Fetched:", data.timeTables);

        }
      } catch (err) {
        console.error("Error fetching class timetables:", err);
      }
    };

    fetchClassTimetables();
  }, []);

  return (
    <div className="classTimetables grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 bg-slate-300">
      {Array.isArray(classTimetables) && classTimetables.length > 0 ? (
        classTimetables.map((item) => (
          <Card6 key={item._id} data={item} isHOD={isHOD} />
        ))
      ) : (
        <p className="text-center col-span-3">No class time tables available.</p>
      )}
    </div>
  );
};

export default ClassTimeTable;
