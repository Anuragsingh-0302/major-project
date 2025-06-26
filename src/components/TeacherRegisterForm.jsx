// src/components/TeacherRegisterForm.jsx

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { showSuccess, showError } from "../utils/toastUtils";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const TeacherRegisterForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
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
        reset(); // clear form
      } else {
        showError(result.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      showError("❌ Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    document.title = "Teacher Registration - DeptHub";
  }, []);

  const subjects = ["DBMS", "OS", "CN", "AI", "DSA"];
  const departments = ["MCA", "BCA"];

  return (
    <>
      <Helmet>
        <title>Teacher Registration - DeptHub</title>
      </Helmet>

      <motion.div
        className="w-full max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Teacher Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField name="name" label="Full Name" register={register} errors={errors} />
            <InputField name="email" label="Email" register={register} errors={errors} type="email" />
            <InputField name="phone" label="Phone" register={register} errors={errors} />
            <InputField name="teacherId" label="Teacher ID" register={register} errors={errors} />
            <InputField name="aadhaar" label="Aadhaar Number" register={register} errors={errors} />

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
          </div>

          {/* Subjects */}
          <div>
            <label className="block font-semibold mb-2">Subjects</label>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((subj) => (
                <label key={subj} className="flex items-center gap-2">
                  <input type="checkbox" value={subj} {...register("subject")} />
                  {subj}
                </label>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div>
            <label className="block font-semibold mb-2">Departments</label>
            <div className="grid grid-cols-2 gap-3">
              {departments.map((dept) => (
                <label key={dept} className="flex items-center gap-2">
                  <input type="checkbox" value={dept} {...register("department")} />
                  {dept}
                </label>
              ))}
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block font-semibold mb-2">Role</label>
            <select
              {...register("role")}
              className="border p-3 rounded w-full"
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
      </motion.div>
    </>
  );
};

const InputField = ({ name, label, register, errors, type = "text" }) => (
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

export default TeacherRegisterForm;
