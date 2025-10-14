import { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';
import { defaultConfig as toastConfig } from './toastConfig';
import { useTheme } from '../../context/ThemeContext';
import styles from './Toastify.module.css';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    // Durante hot-reload o si se usa fuera del provider, retornar un no-op
    console.warn('useToast se está usando fuera de ToastProvider');
    return {
      showToast: () => {} // no-op function
    };
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);

  // Memoriza showToast para evitar recreaciones innecesarias
  const showToast = useCallback((type, backendMessage) => {
    const config = toastConfig[type];
    if (!config) return;

    const id = Date.now();

    const toastData = {
      ...config,
      id,
      message: backendMessage || config.message,
    };

    setNotifications((prev) => [...prev, toastData]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((t) => t.id !== id));
    }, toastData.duration || 5000);
  }, []); // Sin dependencias, la función es estable
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div 
        className={styles.notifications}
        data-theme={isDarkMode ? 'dark' : 'light'}
      >
        {notifications.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => {}} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
