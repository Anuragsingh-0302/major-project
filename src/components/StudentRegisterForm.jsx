// src/components/StudentRegisterForm.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import EditStudentModal from "./EditStudentModal";
import { showSuccess, showError } from "../utils/toastUtils";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const StudentRegisterForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  const role = storedUser?.role;

  const [showPending, setShowPending] = useState(false);
  const [unverifiedStudents, setUnverifiedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    document.title = "Student Registration - DeptHub";
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
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
      console.log("Registration Response:", res.data);
      showSuccess("✅ Student registered successfully!");
      reset(); // Clear the form
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      showError("❌ Failed to register student. Please try again.");
    }
  };

  const fetchUnverifiedStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/unverified", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    <>
      <Helmet>
        <title>Student Registration - DeptHub</title>
      </Helmet>

      <motion.div
        className="w-full max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10 relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Student Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="Full Name" name="name" register={register} errors={errors} />
            <InputField label="Enrollment Number" name="enrollment" register={register} errors={errors} />
            <InputField label="Email" name="email" register={register} errors={errors} type="email" />
            <InputField label="Phone Number" name="phone" register={register} errors={errors} />
            <InputField label="Father's Name" name="fatherName" register={register} errors={errors} />

            <div>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="border p-3 rounded w-full"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="text-red-600 text-sm">{errors.gender.message}</p>}
            </div>

            <div className="md:col-span-2">
              <InputField label="Address" name="address" register={register} errors={errors} />
            </div>

            <InputField label="Aadhaar Number" name="aadhaarNumber" register={register} errors={errors} />
            
            <div>
              <select
                {...register("class", { required: "Class is required" })}
                className="border p-3 rounded w-full"
              >
                <option value="">Select Class</option>
                <option value="MCA">MCA</option>
                <option value="BCA">BCA</option>
              </select>
              {errors.class && <p className="text-red-600 text-sm">{errors.class.message}</p>}
            </div>

            <InputField
              label="Year of Admission (e.g., 2023)"
              name="yearOfAdmission"
              register={register}
              errors={errors}
              type="number"
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
          <div className="lg:absolute top-5 right-5">
            <button
              onClick={() => {
                setShowPending(true);
                fetchUnverifiedStudents();
              }}
              className="bg-green-600  text-white py-3 px-4 rounded w-full lg:w-auto lg:rounded-3xl hover:rounded-md my-4 lg:my-0 transition-all duration-300"
            >
              Pending Requests
            </button>
          </div>
        )}

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

        {selectedStudent && (
          <EditStudentModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onUpdated={handleUpdateSuccess}
          />
        )}
      </motion.div>
    </>
  );
};

// Reusable input field component
const InputField = ({ label, name, register, errors, type = "text" }) => (
  <div>
    <input
      type={type}
      placeholder={label}
      {...register(name, { required: `${label} is required` })}
      className="border p-3 rounded w-full"
    />
    {errors[name] && <p className="text-red-600 text-sm">{errors[name].message}</p>}
  </div>
);

export default StudentRegisterForm;
