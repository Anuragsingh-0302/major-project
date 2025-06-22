// src/components/StudentRegisterForm.jsx

import React, { useState , useEffect } from "react";
import axios from "axios";
import EditStudentModal from "./EditStudentModal"; // make sure this exists
import { showSuccess , showError } from "../utils/toastUtils";

const StudentRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    enrollment: "",
    email: "",
    phone: "",
    fatherName: "",
    gender: "",
    address: "",
    aadhaarNumber: "",
    class: "",
    yearOfAdmission: "",
  });

  useEffect(() => {
    document.title = "Student Registration - DeptHub";
  }, []);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  const role = storedUser?.role;

  const [showPending, setShowPending] = useState(false);
  const [unverifiedStudents, setUnverifiedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      verified: role === "hod" ? true : false,
    };

    let apiUrl = "";
    if (role === "hod") {
      apiUrl = "http://localhost:5000/api/student/registerByHOD";
    } else if (role === "teacher") {
      apiUrl = "http://localhost:5000/api/student/registerByTeacher";
    } else {
      alert("Only HOD or Teacher can register students");
      return;
    }

    try {
      const res = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Student Registered:", res.data);

      // ✅ Success Alert
      showSuccess("✅ Student registered successfully!");

      // ✅ Reset form
      setFormData({
        name: "",
        enrollment: "",
        email: "",
        phone: "",
        fatherName: "",
        gender: "",
        address: "",
        aadhaarNumber: "",
        class: "",
        yearOfAdmission: "",
      });

      // optionally reset form or show alert
    } catch (err) {
      console.error(
        "Error registering student:",
        err.response?.data || err.message
      );
      showError("❌ Failed to register student. Please try again.");
    }
  };

  const fetchUnverifiedStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/student/unverified",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUnverifiedStudents(res.data.students);
    } catch (err) {
      console.error("Error fetching unverified:", err);
      showError("❌ Failed to fetch unverified students.");
    }
  };

  const handleVerify = async (studentId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/student/verify/${studentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUnverifiedStudents((prev) => prev.filter((s) => s._id !== studentId));
    } catch (err) {
      console.error("Error verifying student:", err);
      showError("❌ Failed to verify student.");
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
  };

  const handleUpdateSuccess = (updatedStudent) => {
    setUnverifiedStudents((prev) =>
      prev.map((s) => (s._id === updatedStudent._id ? updatedStudent : s))
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10 relative">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
        Student Registration
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
            type="text"
            name="enrollment"
            placeholder="Enrollment Number"
            required
            className="border p-3 rounded"
            value={formData.enrollment}
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
            placeholder="Phone Number"
            required
            className="border p-3 rounded"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="fatherName"
            placeholder="Father's Name"
            required
            className="border p-3 rounded"
            value={formData.fatherName}
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
          <input
            type="text"
            name="address"
            placeholder="Address"
            required
            className="border p-3 rounded col-span-1 md:col-span-2"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            type="text"
            name="aadhaarNumber"
            placeholder="Aadhaar Number"
            required
            className="border p-3 rounded"
            value={formData.aadhaarNumber}
            onChange={handleChange}
          />
          <select
            name="class"
            required
            className="border p-3 rounded"
            value={formData.class}
            onChange={handleChange}
          >
            <option value="">Select Class</option>
            <option value="MCA">MCA</option>
            <option value="BCA">BCA</option>
          </select>
          <input
            type="number"
            name="yearOfAdmission"
            placeholder="Year of Admission (e.g., 2023)"
            required
            className="border p-3 rounded"
            value={formData.yearOfAdmission}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          Register Student
        </button>
      </form>

      {role === "hod" && (
        <div className="absolute top-5 right-5">
          <button
            onClick={() => {
              setShowPending(true);
              fetchUnverifiedStudents();
            }}
            className="bg-green-500 text-white py-3 px-4 rounded-3xl hover:rounded-md transition-all duration-300"
          >
            Pending Requests
          </button>
        </div>
      )}

      {/* Modal for unverified students */}
      {showPending && (
        <div className="fixed inset-0 backdrop-blur-lg flex justify-center items-start z-50 pt-10 overflow-y-auto">
          <div className="bg-slate-100 w-full max-w-4xl p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-800">
                Unverified Students
              </h2>
              <button
                onClick={() => setShowPending(false)}
                className="text-red-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {unverifiedStudents.length === 0 ? (
              <p className="text-gray-600">No unverified students.</p>
            ) : (
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Enrollment</th>
                    <th className="p-2 border">Class</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {unverifiedStudents.map((student) => (
                    <tr key={student._id}>
                      <td className="p-2 border">{student.name}</td>
                      <td className="p-2 border">{student.enrollment}</td>
                      <td className="p-2 border">{student.class}</td>
                      <td className="p-2 border flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(student)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleVerify(student._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdated={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default StudentRegisterForm;
