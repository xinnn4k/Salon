// src/context/AuthContext.tsx
import React, { createContext, useContext } from 'react';

interface AuthContextType {
  role: string | null;
}

const AuthContext = createContext<AuthContextType>({ role: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const role = localStorage.getItem('userRole');
  return <AuthContext.Provider value={{ role }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
