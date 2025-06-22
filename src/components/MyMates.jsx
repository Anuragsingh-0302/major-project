// src/components/MyMates.jsx

import React from "react";
import Card3 from "./Card3";
import axios from "axios";
import { useEffect, useState } from "react";

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
        console.log(res.data);
        setMates(res.data.mates);
      } catch (err) {
        console.error("Error fetching mates:", err);
      }
    };
    fetchMates();
  }, []);

  return (
    <div className="myMates grid grid-cols-2  bg-slate-300  p-2 gap-3">
      {mates.map((user) => (
        <Card3 key={user._id} user={user} />
      ))}
    </div>
  );
};

export default MyMates;
