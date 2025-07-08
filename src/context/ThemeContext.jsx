import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// Tokens principales para Ant Design
export const themeTokensDark = {
  token: {
    colorPrimary: '#1CB54A',
    colorBgContainer: '#1E1E1E',
    colorText: '#fff',
    colorBorder: '#2A2A2A',
    colorBgElevated: '#252525',
    colorTextPlaceholder: '#B4B4B8',
  },
};

export const themeTokensLight = {
  token: {
    colorPrimary: '#00AA55',
    colorBgContainer: '#FFFFFF',
    colorText: '#1A1A1A',
    colorBorder: '#E0E0E0',
    colorBgElevated: '#F8F9FA',
    colorTextPlaceholder: '#808080',
  },
}; 