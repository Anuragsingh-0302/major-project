import React from "react";
import { motion } from "framer-motion";

const ViewStudentModal = ({ students, onClose, onVerify, onViewProfile }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white w-full max-w-4xl rounded-lg p-6 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">
            Pending Student Requests
          </h2>
          <button onClick={onClose} className="text-red-600 font-bold text-xl">
            ✕
          </button>
        </div>

        {students.length === 0 ? (
          <p>No pending students</p>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="border border-gray-300 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Name:</strong> {student.name}
                  </p>
                  <p>
                    <strong>Enrollment:</strong> {student.enrollment}
                  </p>
                  <p>
                    <strong>Class:</strong> {student.class}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => onViewProfile(student)}
                  >
                    View Profile
                  </button>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => onVerify(student._id)}
                  >
                    Verify
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ViewStudentModal;
