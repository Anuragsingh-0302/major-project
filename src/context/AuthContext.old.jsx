    // src/context/AuthContext.jsx
    import React, { createContext, useState, useEffect, useContext } from 'react';

    const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
      const [userProfile, setUserProfile] = useState(null);

      useEffect(() => {
        const storedProfile = localStorage.getItem('myprofile');
        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        }
      }, []);

      const login = (profile) => {
        localStorage.setItem('myprofile', JSON.stringify(profile));
        setUserProfile(profile);
      };

      const logout = () => {
        localStorage.removeItem('myprofile');
        setUserProfile(null);
      };

      const value = {
        userProfile,
        login,
        logout,
      };

      return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => {
      return useContext(AuthContext);
    };
    