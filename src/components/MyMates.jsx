// src/components/MyMates.jsx

import React, { useEffect, useState } from "react";
import Card3 from "./cards/Card3";
import axios from "axios";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const MyMates = () => {
  const [mates, setMates] = useState([]);

  useEffect(() => {
    document.title = "DeptHub - My Mates";
    const fetchMates = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get("http://localhost:5000/api/role/mymates", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setMates(res.data.mates);
      } catch (err) {
        console.error("Error fetching mates:", err);
      }
    };
    fetchMates();
  }, []);

  return (
    <>
      <Helmet>
        <title>My Mates - DeptHub</title>
      </Helmet>

      <motion.div
        className="myMates grid grid-cols-1 xl:grid-cols-2 bg-slate-300 p-2 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {mates.map((user) => (
          <Card3 key={user._id} user={user} />
        ))}
      </motion.div>
    </>
  );
};

export default MyMates;
