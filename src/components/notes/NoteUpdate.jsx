// src/components/notes/NoteUpdate.jsx

import React from "react";
import { useForm } from "react-hook-form";

const NoteUpdate = ({
  note,
  onCancel,
  onSave,
  setEditFile,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: note.title,
      subject: note.subject,
      description: note.description,
    },
  });

  const handleFormSubmit = (data) => {
    onSave(data); // Will trigger fetchNotes in Notes.jsx
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block font-medium">Title<span className="text-red-500"> *</span></label>
        <input
          type="text"
          {...register("title", { required: true })}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
      </div>

      <div>
        <label className="block font-medium">Subject<span className="text-red-500"> *</span></label>
        <input
          type="text"
          {...register("subject", { required: true })}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.subject && <p className="text-red-500 text-sm">Subject is required</p>}
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          rows={3}
          {...register("description")}
          className="w-full px-3 py-2 border rounded"
        ></textarea>
      </div>

      <div>
        <label className="block font-medium">Replace File (optional)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.md,.html,.txt,.odt,.xls,.xlsx,.ppt,.pptx,.json,.xml"
          onChange={(e) => setEditFile(e.target.files[0])}
          className="w-full"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteUpdate;
