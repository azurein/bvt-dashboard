"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';

interface AuthContextProps {
  isLoggedIn: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const signIn = (token: string) => {
    Cookies.set('accessToken', token);
    setIsLoggedIn(true);
  };

  const signOut = () => {
    Cookies.remove('accessToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
