// src/components/TeachersProfile.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import Card1 from "./Card1";

const TeachersProfile = () => {
  const [profiles, setProfiles] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/role/teachers-librarians"
      );
      setProfiles(res.data.users);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  };

  useEffect(() => {
    fetchData(); // 🔁 called on load
  }, []);

  return (
    <div className="TeachersProfile grid  lg:grid-cols-2 gap-[50px] px-10 py-4 ">
      {profiles.map((user) => (
        <Card1 key={user._id} user={user} fetchProfiles={fetchData} /> // ✅ passed here
      ))}
    </div>
  );
};

export default TeachersProfile;
