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

  // Función para eliminar un toast específico
  const removeToast = useCallback((id) => {
    setNotifications((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Memoriza showToast para evitar recreaciones innecesarias
  const showToast = useCallback((type, backendMessage) => {
    const config = toastConfig[type];
    if (!config) return;

    // Verificar si ya existe un toast del mismo tipo con el mismo mensaje
    const message = backendMessage || config.message;
    let toastId = null;

    setNotifications((prev) => {
      const existingToast = prev.find(
        (toast) => toast.type === type && toast.message === message
      );
      
      // Si ya existe un toast idéntico, no agregar otro
      if (existingToast) {
        console.log(`[Toast] Evitando toast duplicado: ${type} - ${message}`);
        return prev;
      }

      // Usar crypto.randomUUID() para IDs únicos, o fallback a timestamp + random
      toastId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

      const toastData = {
        ...config,
        id: toastId,
        message,
      };

      return [...prev, toastData];
    });

    // Auto-eliminar después de la duración
    if (toastId) {
      setTimeout(() => {
        removeToast(toastId);
      }, config.duration || 5000);
    }
  }, [removeToast]);
  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div 
        className={styles.notifications}
        data-theme={isDarkMode ? 'dark' : 'light'}
      >
        {notifications.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
