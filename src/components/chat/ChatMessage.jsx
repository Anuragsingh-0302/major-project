// src/components/chat/ChatMessage.jsx

import React from "react";

const ChatMessage = ({ message, isOwn }) => {
  const containerStyle = isOwn
    ? "self-end bg-blue-500 text-white rounded-tl-xl rounded-bl-xl rounded-tr-xl"
    : "self-start bg-gray-200 text-black rounded-tr-xl rounded-br-xl rounded-tl-xl";

  const mediaBaseURL = "http://localhost:5000/";

  return (
    <div className={`max-w-[80%] p-3 m-2 ${containerStyle} shadow-md`}>
      {/* Text Message */}
      {message.message && <div className="whitespace-pre-wrap">{message.message}</div>}

      {/* Image */}
      {message.mediaType === "image" && (
        <img
          src={mediaBaseURL + message.media}
          alt="shared media"
          className="mt-2 max-h-[250px] rounded-lg"
        />
      )}

      {/* PDF */}
      {message.mediaType === "pdf" && (
        <div className="mt-2">
          <a
            href={mediaBaseURL + message.media}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-100 underline bg-blue-700 px-3 py-1 rounded-md inline-block"
          >
            📄 View PDF
          </a>
        </div>
      )}

      <div className="text-xs mt-1 opacity-70 text-right">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default ChatMessage;
