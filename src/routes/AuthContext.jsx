// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { get } from '../services/api/Axios/MethodsGeneral';
import {
  getLocalStorage,
  persistLocalStorage,
} from '../utils/localStorageUtility';

import { useToast } from '../services/toastify/ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 👈 nuevo

  useEffect(() => {
    const checkAuth = async () => {
      const token = getLocalStorage('token');
      if (!token) {
        setAuthChecked(true);
        return;
      }

      try {
        const res = await get('get-role');

        if (res.data) {
          setIsAuthenticated(true);
          setUserRole(res.data.role_id);
          persistLocalStorage('name', res.data.name);
          persistLocalStorage('user_id', res.data.user_id);
        }
      } catch (err) {
        showToast('intentoFallido', err?.response?.data?.message);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authChecked,
        userRole,
        setIsAuthenticated,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
