//src/components/notes/NotesUpload.jsx

// src/components/notes/NotesUpload.jsx

import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { showError, showSuccess } from "../../utils/toastUtils.js";
import { IoMdClose } from "react-icons/io";

const allowedExtensions = [
  "pdf", "doc", "docx", "md", "markdown", "html", "htm", "txt",
  "odt", "xls", "xlsx", "ppt", "pptx", "json", "xml",
];

const NotesUpload = ({ onClose, onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!selectedFile) {
      showError("File is required and must be of allowed type.");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("subject", data.subject);
    formData.append("description", data.description || "");
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post("http://localhost:5000/api/notes/upload-note", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        showSuccess("Note uploaded successfully!");
        reset();
        setSelectedFile(null);
        if (onUploadSuccess) onUploadSuccess(); // ✅ refresh note list
        if (onClose) onClose(); // ✅ close modal
      } else {
        showError("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      showError("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileValidation = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setSelectedFile(null);
      setError("file", {
        type: "manual",
        message: "Invalid file type selected.",
      });
    } else {
      setSelectedFile(file);
      clearErrors("file");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg mt-10 relative">
      {/* ❌ Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-gray-700 hover:text-red-600"
          title="Close"
        >
          <IoMdClose />
        </button>
      )}

      <h2 className="text-2xl font-bold mb-6">Upload Note</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Title<span className="text-red-500"> *</span></label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full border rounded-md px-3 py-2"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Subject<span className="text-red-500"> *</span></label>
          <input
            type="text"
            {...register("subject", { required: "Subject is required" })}
            className="w-full border rounded-md px-3 py-2"
          />
          {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            rows={3}
            {...register("description")}
            className="w-full border rounded-md px-3 py-2"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Select File<span className="text-red-500"> *</span></label>
          <input
            type="file"
            onChange={handleFileValidation}
            accept={allowedExtensions.map((ext) => `.${ext}`).join(",")}
            className="w-full px-2 py-1 border rounded"
          />
          {errors.file && <p className="text-red-500 text-sm">{errors.file.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default NotesUpload;
