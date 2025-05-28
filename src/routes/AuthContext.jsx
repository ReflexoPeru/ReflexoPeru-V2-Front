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
  const [authChecked, setAuthChecked] = useState(true); // Ahora siempre está verificado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null); // Nuevo estado para el nombre

  // Eliminamos el useEffect que hacía la verificación automática

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authChecked,
        userRole,
        userName,
        setIsAuthenticated,
        setUserRole,
        setUserName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
