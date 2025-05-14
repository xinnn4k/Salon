import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {

          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const isExpired = tokenData.exp * 1000 < Date.now();
          
          if (isExpired) {

            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
          } else {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);

        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

const login = async (email: string, password: string) => {
  setLoading(true);
  setError(null);

  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) throw new Error('No users found. Please sign up first.');

    const parsedUsers = JSON.parse(storedUsers);

    const matchedUser = parsedUsers.find((user: any) => 
      user.email === email && user.password === password
    );

    if (matchedUser) {
      const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
      const tokenPayload = { 
        sub: matchedUser.id, 
        email: matchedUser.email,
        exp
      };
      const mockToken = `mock.${btoa(JSON.stringify(tokenPayload))}.signature`;

      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(matchedUser));
      setUser(matchedUser);
    } else {
      throw new Error('Email or password is incorrect');
    }

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Login failed');
  } finally {
    setLoading(false);
  }
};

  
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};