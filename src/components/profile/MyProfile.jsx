// src/components/myprofile.jsx

import React, { useState, useEffect } from "react";
import { MdVerifiedUser } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../../redux/auth/authSlice";
import defaultMale from "../../images/male.png";
import defaultFemale from "../../images/female.png";
import axios from "axios";
import { showSuccess, showError } from "../../utils/toastUtils";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const MyProfile = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.auth.userProfile);
  const isHOD = userProfile?.role === "hod";
  const isStudent = userProfile?.role === "student";
  const gender = userProfile?.gender || "male";
  const profileImage = userProfile?.profileImage
    ? `http://localhost:5000${userProfile.profileImage}`
    : gender === "female"
    ? defaultFemale
    : defaultMale;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userProfile });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    document.title = "My Profile - DeptHub";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      try {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "subject" && Array.isArray(value)) {
            value.forEach((val) => formDataToSend.append("subject", val));
          } else {
            formDataToSend.append(key, value);
          }
        });

        if (selectedFile) {
          formDataToSend.append("profileImage", selectedFile);
        }

        const res = await axios.put(
          `http://localhost:5000/api/hod/${userProfile.role}/${userProfile._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        dispatch(updateProfile(res.data.updatedUser));
        showSuccess("Profile updated successfully!");
      } catch (err) {
        console.error("❌ Update error:", err);
        showError("Error updating profile");
      }

      setIsEditing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile - DeptHub</title>
        <meta
          name="description"
          content="View and update your DeptHub profile."
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="myprofile w-full p-6"
      >
        <div className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-800 mb-6">
          <span>
            {userProfile?.role === "student"
              ? `Enrollment - ${userProfile?.enrollment || "N/A"}`
              : `Teacher ID - ${userProfile?.teacherId || "N/A"}`}
          </span>
          <MdVerifiedUser className="text-green-600" />
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-3xl flex flex-col lg:flex-row items-center p-6 mb-8 gap-6"
        >
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center">
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.2}
              scale={1.05}
              transitionSpeed={500}
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-40 h-40 rounded-full shadow-lg shadow-slate-600 object-cover"
              />
            </Tilt>
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="input px-3 py-1.5 rounded-lg bg-blue-300-200 text-gray-800 mx-2 mt-3"
              />
            )}
          </div>
          <div className="w-full md:w-2/3 flex flex-col gap-3">
            <p className="text-lg font-semibold text-gray-700">
              👤 Name:{" "}
              {isEditing ? (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input px-3 py-1.5 rounded-lg bg-blue-50 text-gray-800 mx-2"
                />
              ) : (
                userProfile?.name?.toUpperCase() || "N/A"
              )}
            </p>
            <p className="text-lg font-semibold text-gray-700">
              🎓 Role: {userProfile?.role?.toUpperCase() || "N/A"}
            </p>
            <p className="text-lg font-semibold text-gray-700">
              📧 Email:{" "}
              {isEditing ? (
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input px-3 py-1.5 rounded-lg bg-blue-50 text-gray-800 mx-2"
                />
              ) : (
                userProfile?.email || "N/A"
              )}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-blue-100 p-6 rounded-2xl shadow-md mb-8"
        >
          <div className="text-lg text-gray-800 font-medium">
            📱 Phone:{" "}
            {isEditing ? (
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input px-3 py-1.5 rounded-lg bg-blue-50 text-gray-800 mx-2"
              />
            ) : (
              userProfile?.phone || "N/A"
            )}
          </div>

          <div className="text-lg text-gray-800 font-medium">
            👨‍💻 Username:{" "}
            {isEditing ? (
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input px-3 py-1.5 rounded-lg bg-blue-50 text-gray-800 mx-2"
              />
            ) : (
              userProfile?.username || "N/A"
            )}
          </div>

          <div className="text-lg text-gray-800 font-medium">
            🚻 Gender:{" "}
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input px-3 py-1.5 rounded-lg bg-blue-50 text-gray-800 mx-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            ) : (
              userProfile?.gender?.toUpperCase() || "N/A"
            )}
          </div>

          <div className="text-lg text-gray-800 font-medium">
            {userProfile?.role === "hod"
              ? "🏫 Department: "
              : userProfile?.role === "student"
              ? "🏫 Class: "
              : "🏫 Classes: "}
            {isEditing ? (
              <input
                name="department"
                value={formData.department || formData.class}
                onChange={handleChange}
                className="input px-3 py-1.5 rounded-lg bg-blue-50 text-gray-800 mx-2"
              />
            ) : (
              userProfile?.department || userProfile?.class || "N/A"
            )}
          </div>

          <div className="text-lg text-gray-800 font-medium">
            🆔 Aadhaar:{" "}
            {isEditing ? (
              <input
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                className="input px-3 py-1.5 rounded-lg bg-blue-50 text-gray-800 mx-2"
              />
            ) : isStudent ? (
              userProfile?.aadhaarNumber || "N/A"
            ) : (
              userProfile?.aadhaar || "N/A"
            )}
          </div>

          {!isStudent && (
            <div className="text-lg text-gray-800 font-medium">
              📚 Subjects:{" "}
              {isEditing ? (
                <input
                  name="subject"
                  value={formData.subject?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subject: e.target.value.split(",").map((s) => s.trim()),
                    }))
                  }
                  className="input px-3 py-1.5 rounded-lg bg-blue-50 text-gray-800 mx-2"
                />
              ) : (
                userProfile?.subject?.join(", ")?.toUpperCase() || "N/A"
              )}
            </div>
          )}

          {isStudent && (
            <>
              <div className="text-lg text-gray-800 font-medium">
                🏫 Year of Admission: {userProfile?.yearOfAdmission || "N/A"}
              </div>
              <div className="text-lg text-gray-800 font-medium">
                🏡 Address: {userProfile?.address || "N/A"}
              </div>
            </>
          )}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          {isHOD && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow"
            >
              {isEditing ? "Save" : "Update Profile"}
            </motion.button>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default MyProfile;
