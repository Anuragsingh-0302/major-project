//src/pages/Notes.jsx

// src/pages/Notes.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { showError, showSuccess } from "../utils/toastUtils.js";
import NoteCard from "../components/notes/NoteCard";
import NoteUpdate from "../components/notes/NoteUpdate";
import NotesUpload from "../components/notes/NotesUpload";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchSubject, setSearchSubject] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFile, setEditFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  const userId = user?._id;

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notesList = res.data.notes || [];
      setNotes(notesList);
      setFilteredNotes(notesList);
    } catch (err) {
      console.error(err);
      showError("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSearch = () => {
    const term = searchSubject.trim().toLowerCase();
    if (!term) {
      setFilteredNotes(notes);
      return;
    }
    const results = notes.filter((note) =>
      note.subject.toLowerCase().includes(term)
    );
    setFilteredNotes(results);
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccess("Note deleted");
      fetchNotes();
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      showError("Failed to delete note");
    }
  };

  const handleUpdate = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("subject", data.subject);
    formData.append("description", data.description);
    if (editFile) formData.append("file", editFile);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/notes/${selectedNote._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        showSuccess("Note updated successfully");
        fetchNotes();
        setIsDialogOpen(false);
        setIsEditing(false);
      } else {
        showError("Update failed");
      }
    } catch (err) {
      console.error(err);
      showError("Update failed");
    }
  };

  const handleView = (note) => {
    if (userRole === "student") {
      window.open(`http://localhost:5000${note.file}`, "_blank");
    } else {
      setSelectedNote(note);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold mb-4 text-center">Notes</h1>

        {(userRole === "teacher" || userRole === "hod") && (
          <div className="text-center mb-4">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Upload Note
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center mb-6">
        <input
          type="text"
          placeholder="Search by subject..."
          value={searchSubject}
          onChange={(e) => setSearchSubject(e.target.value)}
          className="border border-gray-400 rounded-l-md px-4 py-2 w-full max-w-md"
        />
        <button
          onClick={handleSearch}
          className="bg-slate-700 text-white px-4 py-2 rounded-r-md hover:bg-gray-800"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            userRole={userRole}
            userId={userId}
            onView={handleView}
          />
        ))}
      </div>

      {/* View/Update Note Modal */}
      {isDialogOpen && selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full relative">
            <h2 className="text-2xl font-bold mb-2">Note Details</h2>
            {isEditing ? (
              <NoteUpdate
                note={selectedNote}
                onCancel={() => setIsEditing(false)}
                onSave={handleUpdate}
                setEditFile={setEditFile}
              />
            ) : (
              <>
                <p><strong>Title:</strong> {selectedNote.title}</p>
                <p><strong>Subject:</strong> {selectedNote.subject}</p>
                <p className="mb-2"><strong>Description:</strong> {selectedNote.description}</p>

                {selectedNote.uploadedBy === userId && (
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleDelete(selectedNote._id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                    >
                      <MdDeleteOutline size={20} /> Delete
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditFile(null);
                      }}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <MdOutlineEdit size={20} /> Update
                    </button>
                  </div>
                )}
              </>
            )}
            <button
              onClick={() => {
                setIsDialogOpen(false);
                setIsEditing(false);
              }}
              className="absolute top-2 right-4 text-black hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Upload Note Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full relative">
            <NotesUpload
              onClose={() => setIsUploadOpen(false)}
              onUploadSuccess={fetchNotes} // ✅ Trigger fetch after upload
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
