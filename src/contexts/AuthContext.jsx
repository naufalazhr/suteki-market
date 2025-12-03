import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize storage
    storage.init();
    
    // Check for existing session
    const sessionUser = storage.getCurrentUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const foundUser = storage.findUser(username, password);
    if (foundUser) {
      setUser(foundUser);
      storage.setCurrentUser(foundUser);
      return { success: true, user: foundUser };
    }
    return { success: false, message: 'Invalid username or password' };
  };

  const loginAsBuyer = (name) => {
    const buyerUser = {
      id: `buyer-${Date.now()}`,
      name,
      role: 'buyer',
    };
    setUser(buyerUser);
    storage.setCurrentUser(buyerUser);
  };

  const loginWithGoogle = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch user info');
      
      const data = await response.json();
      
      const googleUser = {
        id: `google-${data.sub}`,
        name: data.name,
        email: data.email,
        picture: data.picture,
        role: 'buyer',
        isGoogle: true
      };
      
      setUser(googleUser);
      storage.setCurrentUser(googleUser);
      return { success: true };
    } catch (error) {
      console.error("Google Login Error:", error);
      return { success: false, message: 'Failed to login with Google' };
    }
  };

  const logout = () => {
    setUser(null);
    storage.clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsBuyer, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
