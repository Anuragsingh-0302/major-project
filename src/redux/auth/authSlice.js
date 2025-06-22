// src/redux/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ✅ Handle "undefined" string or invalid JSON in localStorage
const storedProfile = localStorage.getItem("myprofile");

let parsedProfile = null;
try {
  parsedProfile =
    storedProfile && storedProfile !== "undefined"
      ? JSON.parse(storedProfile)
      : null;
} catch (err) {
  console.error("❌ Invalid myprofile in localStorage:", err);
  localStorage.removeItem("myprofile");
}

const initialState = {
  userProfile: parsedProfile,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userProfile = action.payload;
      localStorage.setItem("myprofile", JSON.stringify(action.payload));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.userProfile = null;
      localStorage.removeItem("myprofile");
      localStorage.removeItem("token");
    },
    updateProfile: (state, action) => {
      state.userProfile = action.payload;
      localStorage.setItem("myprofile", JSON.stringify(action.payload));
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
