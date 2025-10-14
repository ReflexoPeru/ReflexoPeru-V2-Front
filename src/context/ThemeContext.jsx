import React, { createContext, useContext, useEffect, useState } from 'react';
import { theme } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  persistLocalStorage, 
  getLocalStorage,
  getLocalStorageString,
  setLocalStorageString
} from '../utils/localStorageUtility';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Configuración centralizada de tokens para Ant Design
const getAntdThemeConfig = (isDark) => ({
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    // Colores principales
    colorPrimary: '#1CB54A',
    colorSuccess: '#1CB54A',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    
    // Colores de fondo
    colorBgBase: isDark ? '#1e1e1e' : '#ffffff',
    colorBgContainer: isDark ? '#2a2a2a' : '#ffffff',
    colorBgElevated: isDark ? '#333333' : '#ffffff',
    colorBgLayout: isDark ? '#1e1e1e' : '#f5f5f5',
    
    // Colores de texto
    colorText: isDark ? '#ffffff' : '#333333',
    colorTextBase: isDark ? '#ffffff' : '#333333',
    colorTextSecondary: isDark ? '#9CA3AF' : '#666666',
    colorTextTertiary: isDark ? '#6B7280' : '#999999',
    colorTextQuaternary: isDark ? '#4B5563' : '#cccccc',
    colorTextPlaceholder: isDark ? '#aaaaaa' : '#bfbfbf',
    
    // Colores de bordes
    colorBorder: isDark ? '#444444' : '#e0e0e0',
    colorBorderSecondary: isDark ? '#555555' : '#f0f0f0',
    
    // Configuraciones generales
    borderRadius: 8,
    controlHeight: 40,
    fontSize: 14,
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  },
  components: {
    Button: {
      colorPrimary: '#1CB54A',
      colorPrimaryHover: '#148235',
      colorPrimaryActive: '#0e5c28',
      borderRadius: 6,
      fontWeight: 500,
      colorText: isDark ? '#ffffff' : '#333333',
      colorBgContainer: isDark ? '#2a2a2a' : '#ffffff',
      colorBorder: isDark ? '#444444' : '#e0e0e0',
    },
    Input: {
      colorBgContainer: isDark ? '#2a2a2a' : '#f5f5f5',
      colorText: isDark ? '#ffffff' : '#333333',
      colorBorder: isDark ? '#444444' : '#e0e0e0',
      colorTextPlaceholder: isDark ? '#aaaaaa' : '#bfbfbf',
      activeBorderColor: '#1CB54A',
      hoverBorderColor: '#1CB54A',
      activeShadow: '0 0 0 2px rgba(28, 181, 74, 0.2)',
    },
    Select: {
      colorPrimary: '#1CB54A',
      colorBgContainer: isDark ? '#2a2a2a' : '#f5f5f5',
      colorBgElevated: isDark ? '#2a2a2a' : '#f5f5f5',
      colorText: isDark ? '#ffffff' : '#333333',
      colorBorder: isDark ? '#444444' : '#e0e0e0',
      colorTextPlaceholder: isDark ? '#aaaaaa' : '#bfbfbf',
      controlItemBgHover: isDark ? '#444444' : '#f5f5f5',
      optionSelectedBg: isDark ? '#1CB54A' : '#e6f7ff',
      optionActiveBg: isDark ? '#3a3a3a' : '#f5f5f5',
    },
    DatePicker: {
      colorTextPlaceholder: isDark ? '#aaaaaa' : '#bfbfbf',
      colorBgContainer: isDark ? '#2a2a2a' : '#f5f5f5',
      colorBgElevated: isDark ? '#2a2a2a' : '#f5f5f5',
      colorText: isDark ? '#ffffff' : '#333333',
      colorTextHeading: isDark ? '#ffffff' : '#333333',
      colorBorder: isDark ? '#444444' : '#e0e0e0',
      borderRadius: 4,
      hoverBorderColor: isDark ? '#555555' : '#1CB54A',
      activeBorderColor: '#1CB54A',
      colorIcon: isDark ? '#ffffff' : '#666666',
      colorIconHover: '#1CB54A',
      colorPrimary: '#1CB54A',
      cellHoverBg: 'rgba(28, 181, 74, 0.2)',
      cellSelectedBg: '#1CB54A',
      cellSelectedWithRangeBg: 'rgba(28, 181, 74, 0.3)',
      colorSplit: isDark ? '#444444' : '#f0f0f0',
    },
    TimePicker: {
      colorTextPlaceholder: isDark ? '#aaaaaa' : '#bfbfbf',
      colorBgContainer: isDark ? '#2a2a2a' : '#f5f5f5',
      colorBgElevated: isDark ? '#2a2a2a' : '#f5f5f5',
      colorText: isDark ? '#ffffff' : '#333333',
      colorTextHeading: isDark ? '#ffffff' : '#333333',
      colorBorder: isDark ? '#444444' : '#e0e0e0',
      hoverBorderColor: isDark ? '#555555' : '#1CB54A',
      activeBorderColor: '#1CB54A',
      colorIcon: isDark ? '#ffffff' : '#666666',
      colorIconHover: '#1CB54A',
      colorPrimary: '#1CB54A',
      cellHoverBg: 'rgba(28, 181, 74, 0.2)',
      cellSelectedBg: '#1CB54A',
      cellSelectedWithRangeBg: 'rgba(28, 181, 74, 0.3)',
      cellSelectedColor: isDark ? '#000000' : '#ffffff',
      colorTextBase: isDark ? '#ffffff' : '#333333',
    },
    Table: {
      headerBg: isDark ? '#272727' : '#fafafa',
      headerColor: isDark ? '#ffffff' : '#333333',
      colorBgContainer: isDark ? '#2a2a2a' : '#ffffff',
      borderColor: isDark ? '#555555' : '#f0f0f0',
      rowHoverBg: isDark ? '#3a3a3a' : '#f5f5f5',
      colorText: isDark ? '#ffffff' : '#333333',
    },
    Modal: {
      contentBg: isDark ? 'linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%)' : '#ffffff',
      headerBg: 'transparent',
      titleColor: isDark ? '#ffffff' : '#333333',
      colorText: isDark ? '#b0b0b0' : '#666666',
      borderRadiusLG: 16,
      paddingContentHorizontal: 0,
      paddingMD: 0,
    },
    Menu: {
      itemMarginInline: 0,
      iconSize: 18,
      itemColor: isDark ? '#ffffff' : '#333333',
      itemHoverColor: isDark ? '#ffffff' : '#333333',
      itemHoverBg: 'rgba(28, 181, 74, 0.15)',
      itemSelectedColor: '#ffffff',
      itemSelectedBg: '#1CB54A',
      itemActiveBg: '#1CB54A',
      subMenuItemSelectedColor: isDark ? '#8ad366' : '#1CB54A',
      fontSize: 15,
      colorBgContainer: isDark ? '#1e1e1e' : '#ffffff',
    },
    Radio: {
      colorPrimary: '#1CB54A',
      colorPrimaryHover: '#148235',
    },
    Form: {
      labelColor: isDark ? '#ffffff' : '#333333',
      itemMarginBottom: 16,
    },
    Spin: {
      colorPrimary: '#1CB54A',
    },
    Pagination: {
      colorPrimary: '#1CB54A',
      colorPrimaryHover: '#148235',
      colorPrimaryBorder: '#1CB54A',
      colorBgContainer: isDark ? '#2a2a2a' : '#ffffff',
      colorText: isDark ? '#ffffff' : '#333333',
      colorTextDisabled: isDark ? '#666666' : '#bfbfbf',
      // Color del texto cuando el item está activo (importante para que se vea blanco)
      itemActiveColorDisabled: '#ffffff',
      // Fondo del item activo
      controlItemBgActive: '#1CB54A',
      controlItemBgActiveHover: '#148235',
      itemActiveBg: '#1CB54A',
      itemActiveBgDisabled: isDark ? '#3a3a3a' : '#f5f5f5',
      // Fondos de items normales
      itemBg: isDark ? '#2a2a2a' : '#ffffff',
      itemInputBg: isDark ? '#2a2a2a' : '#ffffff',
      itemLinkBg: isDark ? '#2a2a2a' : '#ffffff',
      itemSize: 32,
      borderRadius: 6,
      colorBorder: isDark ? '#444444' : '#e0e0e0',
    },
  },
});

export const ThemeProvider = ({ children }) => {
  // Obtener tema del localStorage o usar 'light' por defecto (tema claro)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = getLocalStorageString('theme');
      return savedTheme ? savedTheme === 'dark' : false; 
    } catch (error) {
      console.warn('Error al cargar tema del localStorage, usando tema claro por defecto:', error);
      return false; 
    }
  });

  // Estado para controlar la animación de transición
  const [isTransitioning, setIsTransitioning] = useState(false);
  useEffect(() => {
    document.documentElement.classList.add('theme-transitioning');
    setIsTransitioning(true);
    
    // Pequeño delay para que la transición se vea
    const timeoutId = setTimeout(() => {
      document.documentElement.setAttribute(
        'data-theme', 
        isDarkMode ? 'dark' : 'light'
      );
      
      // Remover clase de transición después del cambio
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
        setIsTransitioning(false);
      }, 300);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [isDarkMode]);

  // Función para alternar tema
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    setLocalStorageString('theme', newTheme ? 'dark' : 'light');
  };

  // Función para establecer tema específico
  const setTheme = (themeName) => {
    const isDark = themeName === 'dark';
    setIsDarkMode(isDark);
    setLocalStorageString('theme', themeName);
  };

  // Obtener configuración de Ant Design
  const antdTheme = getAntdThemeConfig(isDarkMode);

  const value = {
    isDarkMode,
    currentTheme: isDarkMode ? 'dark' : 'light',
    toggleTheme,
    setTheme,
    antdTheme,
    isTransitioning,
  };

  return (
    <ThemeContext.Provider value={value}>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </ThemeContext.Provider>
  );
};
