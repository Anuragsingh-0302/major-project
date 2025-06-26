// src/pages/About.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const About = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const renderLink = (name, url) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      {name}
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <Helmet>
        <title>About DeptHub</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8"
      >
        <h1 className="text-4xl font-bold text-center text-[#0f0e47] mb-6">
          About DeptHub
        </h1>

        <p className="text-gray-700 text-lg mb-4 leading-relaxed">
          <strong>DeptHub</strong> is a centralized platform designed to
          simplify and manage departmental activities in educational
          institutions. It provides a modern solution for Students, Teachers,
          HODs, and Librarians to collaborate, communicate, and maintain
          academic workflows with ease.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          🚀 Key Features:
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>📚 Library Management System</li>
          <li>🧑‍🏫 Role-based Dashboards</li>
          <li>✅ Attendance Tracking</li>
          <li>💬 Real-time Chat System with Media Sharing</li>
          <li>🔐 Secure Login, JWT Authentication & Password Reset</li>
          <li>📅 Event and TimeTable Management</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">
          👨‍💻 Developed By:
        </h2>
        <p className="text-gray-700 mb-1">Anurag Singh</p>
        <p className="text-gray-600 text-sm">
          Built using:{" "}
          {renderLink("MongoDB", "https://www.mongodb.com/")},{" "}
          {renderLink("Express.js", "https://expressjs.com/")},{" "}
          {renderLink("React.js", "https://reactjs.org/")},{" "}
          {renderLink("Node.js", "https://nodejs.org/")},{" "}
          {renderLink("Tailwind CSS", "https://tailwindcss.com/")}, &{" "}
          {renderLink("Socket.IO", "https://socket.io/")}
        </p>

        {/* ✅ Frontend Tech Stack */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">
          🌐 Frontend Technologies:
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>{renderLink("React Router", "https://reactrouter.com/")} - Navigation and routing</li>
          <li>{renderLink("Helmet", "https://github.com/nfl/react-helmet")} - Page titles & meta tags</li>
          <li>{renderLink("React Toastify", "https://fkhadra.github.io/react-toastify/")} - Toast alerts</li>
          <li>{renderLink("React Hook Form", "https://react-hook-form.com/")} - Form management</li>
          <li>{renderLink("React Icons", "https://react-icons.github.io/react-icons/")} - Icon library</li>
          <li>{renderLink("Axios", "https://axios-http.com/")} - API request handler</li>
          <li>{renderLink("Framer Motion", "https://www.framer.com/motion/")} - Animations</li>
          <li>{renderLink("React Redux", "https://react-redux.js.org/")} - State management</li>
          <li>{renderLink("React Parallax Tilt", "https://www.npmjs.com/package/react-parallax-tilt")} - Tilt effects</li>
        </ul>

        {/* ✅ Backend Tech Stack */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">
          🖥️ Backend Technologies:
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>{renderLink("Express", "https://expressjs.com/")} - Server framework</li>
          <li>{renderLink("Mongoose", "https://mongoosejs.com/")} - MongoDB ODM</li>
          <li>{renderLink("jsonwebtoken (JWT)", "https://github.com/auth0/node-jsonwebtoken")} - Authentication</li>
          <li>{renderLink("Bcrypt", "https://www.npmjs.com/package/bcrypt")} - Password encryption</li>
          <li>{renderLink("Nodemailer", "https://nodemailer.com/")} - Email services</li>
          <li>{renderLink("Multer", "https://www.npmjs.com/package/multer")} - File uploads</li>
          <li>{renderLink("Moment.js", "https://momentjs.com/")} - Date/time formatting</li>
          <li>{renderLink("ExcelJS", "https://github.com/exceljs/exceljs")} - Excel export</li>
          <li>{renderLink("Dotenv", "https://www.npmjs.com/package/dotenv")} - Env variable loader</li>
          <li>{renderLink("Cors", "https://www.npmjs.com/package/cors")} - Enable frontend-backend requests</li>
          <li>{renderLink("Cookie Parser", "https://www.npmjs.com/package/cookie-parser")} - Cookie middleware</li>
          <li>{renderLink("Node-Cron", "https://www.npmjs.com/package/node-cron")} - Cron jobs</li>
        </ul>

        {/* ✅ Tools & Runtime */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">
          🧪 Tools Used for Testing:
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>{renderLink("Postman", "https://www.postman.com/")} - API testing</li>
          <li>{renderLink("Nodemon", "https://www.npmjs.com/package/nodemon")} - Auto server restart</li>
        </ul>

        {/* ✅ Runtime Info */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">
          ⚙️ Runtime Details:
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>
            <strong>Frontend:</strong> running on <code>localhost:5173</code>{" "}
            (Vite default)
          </li>
          <li>
            <strong>Backend:</strong> running on <code>localhost:5000</code>{" "}
            (Express server)
          </li>
          <li>
            <strong>MongoDB:</strong> running locally on{" "}
            <code>localhost:12017</code>
          </li>
        </ul>

        {/* ✅ Developer Info */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">
          👨‍💻 Developed By:
        </h2>
        <p className="text-gray-700 mb-1">Anurag Singh</p>
        <p className="text-gray-600 text-sm">
          Full Stack Developer — MERN Stack | Tailwind CSS | Socket.IO
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">
          🏫 Institution:
        </h2>
        <p className="text-gray-700">
          Awadhesh Pratap Singh University, Rewa, M.P.
        </p>
        <p className="text-gray-600 text-sm">Academic Project — Year [2025]</p>

        <div className="text-center mt-10">
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-[#0f0e47] text-white px-6 py-3 rounded-full hover:bg-[#1a1a65] transition"
          >
            ← Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
