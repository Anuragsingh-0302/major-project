// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
// add others later

const store = configureStore({
  reducer: {
    auth: authReducer,
    // chat: chatReducer,
    // event: eventReducer,
    // ...
  },
});

export default store;
