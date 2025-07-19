// src/components/HODProfile.jsx

import React, { useEffect, useState } from "react";
import Card2 from "./cards/Card2";
import axios from "axios";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const HODProfile = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    document.title = "DeptHub - HOD Profile";
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/role/hods");
        setProfiles(res.data.hods);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>HOD Profile - DeptHub</title>
      </Helmet>

      <motion.div
        className="HODProfile flex justify-center rounded-xl p-4 w-full min-h-[80vh] bg-slate-200 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {profiles.map((user) => (
          <Card2 key={user._id} user={user} />
        ))}
      </motion.div>
    </>
  );
};

export default HODProfile;
