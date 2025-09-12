import React, { createContext, useContext, useEffect, useState } from 'react';
import { theme } from 'antd';
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
  },
});

export const ThemeProvider = ({ children }) => {
  // Obtener tema del localStorage o usar 'dark' por defecto (tema actual)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = getLocalStorageString('theme');
      return savedTheme ? savedTheme === 'dark' : true; // true por defecto (oscuro)
    } catch (error) {
      console.warn('Error al cargar tema del localStorage, usando tema oscuro por defecto:', error);
      return true; // Tema oscuro por defecto si hay error
    }
  });

  // Aplicar el atributo data-theme al documento con transición suave
  useEffect(() => {
    // Agregar clase de transición antes del cambio
    document.documentElement.classList.add('theme-transitioning');
    
    // Pequeño delay para que la transición se vea
    const timeoutId = setTimeout(() => {
      document.documentElement.setAttribute(
        'data-theme', 
        isDarkMode ? 'dark' : 'light'
      );
      
      // Remover clase de transición después del cambio
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
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
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
