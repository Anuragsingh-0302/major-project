// src/hooks/useUnreadStatus.js
import { useEffect, useState } from "react";
import axios from "axios";

const useUnreadStatus = (otherUserId) => {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const checkUnread = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/unread/${otherUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHasUnread(res.data.unreadCount > 0); // ✅ boolean fix
      } catch (err) {
        console.error("Unread check failed", err);
      }
    };

    if (otherUserId) checkUnread();
  }, [otherUserId]);

  return hasUnread;
};

export default useUnreadStatus;
