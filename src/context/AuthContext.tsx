import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser, removeToken, setToken, DecodedToken } from '../utils/auth';
import { login as apiLogin } from '../utils/api';

interface AuthContextProps {
  user: DecodedToken | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const loggedInUser = getUser();
    setUser(loggedInUser);
  }, []);

  const login = async (username: string, password: string) => {
    const { token } = await apiLogin(username, password);
    setToken(token);
    const loggedInUser = getUser();
    setUser(loggedInUser);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};