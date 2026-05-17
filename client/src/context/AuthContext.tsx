import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  name: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: any) => Promise<boolean>;
  logout: () => void;
  hasPermission: (action: string, module: string) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sanitrax_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          // Re-hydrate user from token or storage
          const savedUser = localStorage.getItem('sanitrax_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            setUser({
              id: decoded.id,
              name: decoded.name,
              role: decoded.role,
              permissions: decoded.permissions || []
            });
          }
        }
      } catch (e) {
        logout();
      }
    }
    setIsLoading(false);
  }, [token]);

  const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return `http://localhost:4001`;
    return window.location.origin;
  };

  const login = async (credentials: any) => {
    const response = await fetch(`${getApiUrl()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('sanitrax_token', data.token);
    localStorage.setItem('sanitrax_user', JSON.stringify(data.user));
    return true;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sanitrax_token');
    localStorage.removeItem('sanitrax_user');
  };

  const hasPermission = (action: string, module: string) => {
    if (!user) return false;
    // SuperAdmin bypass or exact match
    if (user.role === 'SuperAdmin') return true;
    return user.permissions.includes(`${action}:${module}`);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      hasPermission,
      isAuthenticated: !!token, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
