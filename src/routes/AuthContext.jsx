// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 👈 nuevo

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthChecked(true);
        return;
      }

      try {
        const res = await axios.get('/api/validate-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.valid) {
          setIsAuthenticated(true);
          setUserRole(res.data.role); // 👈 guarda el rol desde el backend
        }
      } catch (err) {
        console.error('Token inválido');
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, authChecked, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};
