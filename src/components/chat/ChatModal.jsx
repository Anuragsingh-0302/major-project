// src/components/chat/ChatModal.jsx

// src/components/chat/ChatModal.jsx

import React, { useEffect, useRef, useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdPermMedia } from "react-icons/md";
import { ImDownload2 } from "react-icons/im";
import { sendMessage, fetchMessages } from "../../api/chatApi";
import socket, { listenToMessages, stopListening } from "../../socket";

const ChatModal = ({ onClose, receiver, currentUser }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const messageEndRef = useRef(null);
  const [conversationId, setConversationId] = useState(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  useEffect(() => {
    if (!currentUser?._id || !receiver?._id) return;

    const fetchAndJoin = async () => {
      try {
        const { data } = await fetchMessages(currentUser, receiver);
        setMessages(data.messages);
        setConversationId(data.conversationId);
        socket.emit("joinRoom", data.conversationId);
        scrollToBottom();
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };

    fetchAndJoin();
  }, [receiver, currentUser]);

  useEffect(() => {
    if (!conversationId) return;

    const handleIncoming = (newMsg) => {
      if (
        newMsg.conversation === conversationId &&
        String(newMsg.sender) !== String(currentUser._id)
      ) {
        setMessages((prev) => [...prev, newMsg]);
        scrollToBottom();
      }
    };

    listenToMessages(handleIncoming);
    return () => stopListening();
  }, [conversationId, currentUser]);

  const handleSend = async () => {
    if (!message.trim() && !mediaFile) return;

    const newMessage = {
      sender: currentUser._id,
      message: message,
      media: mediaFile ? URL.createObjectURL(mediaFile) : null,
      mediaType: mediaFile ? mediaFile.type.split("/")[0] : null,
      conversation: conversationId,
    };

    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();

    try {
      const formData = new FormData();
      formData.append("senderId", currentUser._id);
      formData.append(
        "senderModel",
        currentUser.role === "student" ? "StudentInfo" : "TeacherInfo"
      );
      formData.append("receiverId", receiver._id);
      formData.append(
        "receiverModel",
        receiver.role === "student" ? "StudentInfo" : "TeacherInfo"
      );
      formData.append("conversationId", conversationId);
      if (message) formData.append("message", message);
      if (mediaFile) formData.append("media", mediaFile);

      const { data } = await sendMessage(formData);
      if (data?.message) {
        // Optional: update with server response if needed
      }

      setMessage("");
      setMediaFile(null);
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  if (!currentUser?._id || !receiver?._id) {
    return (
      <div className="fixed top-0 left-0 w-full h-full backdrop-blur-md  flex justify-center items-center z-50">
        <div className="bg-slate-200 p-6 rounded-xl shadow-md text-center">
          <div className="text-blue-700 font-semibold mb-2 flex justify-center items-center gap-2">
            ⚠️ Invalid user session
          </div>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full backdrop-blur-md flex justify-center items-center z-50">
        <div className="bg-slate-600 w-full max-w-lg rounded-xl border-6  border-slate-300 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b-2 border-gray-300">
            <h2 className="font-bold text-lg text-yellow-300">
              {receiver.name}{" "}
              <span className="text-gray-300 text-sm">
                ( {receiver.role === "student" ? receiver.enrollment : receiver.teacherId} )
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-500 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Media preview before sending */}
          {mediaFile && (
            <div className="p-2 flex items-center gap-2 border-b border-gray-300">
              {mediaFile.type.startsWith("image") ? (
                <img
                  src={URL.createObjectURL(mediaFile)}
                  alt="Preview"
                  className="max-h-28 rounded-lg"
                />
              ) : (
                <div className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded">
                  📄 {mediaFile.name}
                </div>
              )}
              <button
                onClick={() => setMediaFile(null)}
                className="text-red-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="p-4 h-96 overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  String(msg.sender) === String(currentUser._id)
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="bg-blue-200 text-black text-lg px-1 rounded-lg mb-2 max-w-[70%] break-words">
                  {msg.message && <div>{msg.message}</div>}

                  {msg.mediaType === "image" && msg.media && (
                    <img
                      src={`http://localhost:5000${msg.media}`}
                      alt="sent-img"
                      className="mt-1 mb-1 rounded-lg max-w-full h-auto cursor-pointer"
                      onClick={() =>
                        setPreviewMedia({
                          url: `http://localhost:5000${msg.media}`,
                          type: "image",
                          name: msg.media.split("/").pop(),
                        })
                      }
                    />
                  )}

                  {msg.mediaType === "pdf" && msg.media && (
                    <a
                      className="mt-2 underline text-blue-500 block cursor-pointer"
                      onClick={() =>
                        setPreviewMedia({
                          url: `http://localhost:5000${msg.media}`,
                          type: "pdf",
                          name: msg.media.split("/").pop(),
                        })
                      }
                    >
                      📄 View PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>

          {/* Input */}
          <div className="p-3 border-t flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border rounded-full bg-slate-100 text-black px-4 py-2"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <label htmlFor="media-input">
              <MdPermMedia className="text-2xl text-blue-200 cursor-pointer" />
              <input
                id="media-input"
                type="file"
                className="hidden"
                onChange={(e) => setMediaFile(e.target.files[0])}
                accept="image/*,.pdf"
              />
            </label>
            <button
              onClick={handleSend}
              className="text-blue-600 bg-slate-100 rounded-full pr-2 pl-1 pb-1 pt-2 hover:bg-blue-200 hover:text-slate-600 transition-all ml-1"
            >
              <RiSendPlaneFill className=" text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {/* 🔍 Preview Fullscreen Modal */}
      {previewMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="relative max-w-[95vw] max-h-[90vh]">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-2 right-2 text-white text-4xl font-bold"
            >
              ×
            </button>
            <a
              href={previewMedia.url}
              download={previewMedia.name}
              className="absolute flex items-center gap-2 bottom-2 left-2 bg-slate-200 text-black px-4 py-2 rounded-lg shadow-sm shadow-green-400 border-2 border-green-500 hover:bg-green-300 transition-all"
            >
              <ImDownload2 /> Download
            </a>
            {previewMedia.type === "image" ? (
              <img
                src={previewMedia.url}
                alt="Preview"
                className="max-w-full max-h-[85vh] rounded-xl"
              />
            ) : (
              <iframe
                src={previewMedia.url}
                title="Preview PDF"
                className="w-[90vw] h-[85vh] rounded-xl bg-white"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatModal;
