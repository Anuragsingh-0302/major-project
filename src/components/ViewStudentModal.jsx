import React from "react";

const ViewStudentModal = ({ students, onClose, onVerify, onViewProfile }) => {
  // const [selected, setSelected] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg p-6 overflow-y-auto max-h-[90vh]">
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
              <div
                key={student._id}
                className="border border-gray-300 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p><strong>Name:</strong> {student.name}</p>
                  <p><strong>Enrollment:</strong> {student.enrollment}</p>
                  <p><strong>Class:</strong> {student.class}</p>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudentModal;
