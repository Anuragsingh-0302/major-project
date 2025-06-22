// src/components/UpdateTeacherForm.jsx

import React, { useState } from "react";

const UpdateTeacherForm = ({ user, onClose, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    teacherId: user.teacherId || "",
    gender: user.gender || "",
    aadhaar: user.aadhaar || "",
    department: user.department || [],
    subject: user.subject || [],
    profileImage: null,
  });

  const [changedFields, setChangedFields] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setChangedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    const updated = checked
      ? [...formData[field], value]
      : formData[field].filter((item) => item !== value);
    setFormData((prev) => ({ ...prev, [field]: updated }));
    setChangedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
    setChangedFields((prev) => ({ ...prev, profileImage: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = new FormData();

    Object.keys(changedFields).forEach((field) => {
      if (field === "profileImage") {
        if (formData.profileImage) payload.append("profileImage", formData.profileImage);
      } else {
        if (Array.isArray(formData[field])) {
          formData[field].forEach((val) => payload.append(field, val));
        } else {
          payload.append(field, formData[field]);
        }
      }
    });

    try {
      const res = await fetch(`http://localhost:5000/api/teacher/update/${user._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const result = await res.json();

      if (res.ok) {
        onUpdate(result.updatedTeacher);
        onClose();
      } else {
        alert(result.message || "Update failed");
      }
    } catch (err) {
      alert("Update error");
      console.error(err);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl max-w-xl w-full relative">
        <button className="absolute top-4 right-4 text-xl" onClick={onClose}>✖</button>
        <h2 className="text-2xl font-bold mb-4">Update Teacher</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="border p-2 rounded" />
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="border p-2 rounded" />
          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="border p-2 rounded" />
          <input type="text" name="teacherId" value={formData.teacherId} onChange={handleInputChange} placeholder="Teacher ID" className="border p-2 rounded" />
          <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} placeholder="Aadhaar" className="border p-2 rounded" />

          <select name="gender" value={formData.gender} onChange={handleInputChange} className="border p-2 rounded">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <div>
            <label className="font-semibold">Departments</label>
            <div className="flex gap-3">
              {["MCA", "BCA"].map((dept) => (
                <label key={dept}>
                  <input type="checkbox" value={dept} checked={formData.department.includes(dept)} onChange={(e) => handleCheckboxChange(e, "department")} />
                  {dept}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold">Subjects</label>
            <div className="flex gap-3 flex-wrap">
              {["DBMS", "OS", "CN", "AI", "DSA"].map((subj) => (
                <label key={subj}>
                  <input type="checkbox" value={subj} checked={formData.subject.includes(subj)} onChange={(e) => handleCheckboxChange(e, "subject")} />
                  {subj}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label>Update Profile Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange}  className="border p-2 ml-2 text-red-600 rounded"/>
          </div>

          <div className="flex justify-between">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Update</button>
            <button type="button" onClick={() => onDelete(user._id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTeacherForm;
