// src/components/TeacherRegisterForm.jsx

import React, { useState , useEffect } from "react";
import { showSuccess , showError } from "../utils/toastUtils";

const TeacherRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    teacherId: "",
    gender: "",
    aadhaar: "",
    department: [],
    subject: [],
    role: "teacher",
  });

  useEffect(() => {
    document.title = "Teacher Registration - DeptHub";
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e, field) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    const updated = isChecked
      ? [...formData[field], value]
      : formData[field].filter((item) => item !== value);
    setFormData({ ...formData, [field]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/teacher/register-by-hod",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();

      if (res.ok) {
        showSuccess("✅ Teacher registered successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          teacherId: "",
          gender: "",
          aadhaar: "",
          department: [],
          subject: [],
          role: "teacher",
        });
      } else {
        showError(result.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      showError("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
        Teacher Registration
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="border p-3 rounded"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="border p-3 rounded"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            required
            className="border p-3 rounded"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="teacherId"
            placeholder="Teacher ID"
            required
            className="border p-3 rounded"
            value={formData.teacherId}
            onChange={handleChange}
          />
          <input
            type="text"
            name="aadhaar"
            placeholder="Aadhaar Number"
            required
            className="border p-3 rounded"
            value={formData.aadhaar}
            onChange={handleChange}
          />
          <select
            name="gender"
            required
            className="border p-3 rounded"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Subjects */}
        <div>
          <label className="block font-semibold mb-2">Subjects</label>
          <div className="grid grid-cols-2 gap-3">
            {["DBMS", "OS", "CN", "AI", "DSA"].map((subj) => (
              <label key={subj} className="flex items-center gap-2">
                <input
                  name="subject"
                  type="checkbox"
                  value={subj}
                  checked={formData.subject.includes(subj)}
                  onChange={(e) => handleCheckboxChange(e, "subject")}
                />
                {subj}
              </label>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div>
          <label className="block font-semibold mb-2">Departments</label>
          <div className="grid grid-cols-2 gap-3">
            {["MCA", "BCA"].map((dept) => (
              <label key={dept} className="flex items-center gap-2">
                <input
                  name="department"
                  type="checkbox"
                  value={dept}
                  checked={formData.department.includes(dept)}
                  onChange={(e) => handleCheckboxChange(e, "department")}
                />
                {dept}
              </label>
            ))}
          </div>
        </div>

        {/* Role (Fixed as teacher) */}
        <div>
          <label className="block font-semibold mb-2">Role</label>
          <select
            name="role"
            className="border p-3 rounded w-full"
            value={formData.role}
            onChange={handleChange}
            disabled
          >
            <option value="teacher">Teacher</option>
            <option value="hod">HOD</option>
            <option value="librarian">Librarian</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          Register Teacher
        </button>
      </form>
    </div>
  );
};

export default TeacherRegisterForm;
