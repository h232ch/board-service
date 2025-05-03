import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  userInfo: any | null;
  login: (username: string, userInfo: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState<any | null>(null);

  const login = (username: string, userInfo: any) => {
    setIsLoggedIn(true);
    setUsername(username);
    setUserInfo(userInfo);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      username,
      userInfo,
      login,
      logout
    }}>
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