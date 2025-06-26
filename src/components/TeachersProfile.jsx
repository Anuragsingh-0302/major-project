// src/components/TeachersProfile.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import Card1 from "./Card1";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

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
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Teachers & Librarians - DeptHub</title>
        <meta name="description" content="View all teacher and librarian profiles in DeptHub." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="TeachersProfile grid lg:grid-cols-2 gap-[50px] px-10 py-4"
      >
        {profiles.map((user) => (
          <Card1 key={user._id} user={user} fetchProfiles={fetchData} />
        ))}
      </motion.div>
    </>
  );
};

export default TeachersProfile;
