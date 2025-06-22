import React from "react";
import Card2 from "./Card2";
import { useEffect, useState } from "react";
import axios from "axios";

const HODProfile = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    document.title = "DeptHub - HOD Profile";
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/role/hods"
        );
        console.log(res.data);

        // set only the users array
        setProfiles(res.data.hods);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="HODProfile flex justify-center rounded-xl p-4 w-[100%] min-h-[80vh] bg-slate-200 shadow-2xl">
      {profiles.map((user) => (
        <Card2 key={user._id} user={user} />
      ))}
    </div>
  );
};

export default HODProfile;
