// src/pages/ContactUs.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccess, showError } from "../utils/toastUtils";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet"; // ✅ Helmet added

const ContactUs = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/contact", formData);
      console.log(res.data);
      showSuccess("✅ Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" }); // reset form
    } catch (err) {
      console.error(err);
      showError("❌ Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="min-h-[90vh] bg-slate-200 py-10 px-4">
      {/* ✅ Helmet Title */}
      <Helmet>
        <title>Contact Us - DeptHub</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8"
      >
        <h1 className="text-4xl font-bold text-center text-[#0f0e47] mb-6">
          Contact Us
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f0e47]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f0e47]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              required
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f0e47]"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-slate-700 text-white font-semibold py-2 rounded-full hover:bg-black transition"
          >
            Send Message
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-[#0f0e47] hover:underline font-medium"
          >
            ← Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;
