import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuickAccess.module.css';
import { Table, FileDoc } from '@phosphor-icons/react';
import { useTheme } from '../../../../context/ThemeContext';

const QuickAccess = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const quickLinks = [
    {
      icon: <Table size={24} className={styles.icon} weight="fill" />,
      text: 'Tabla de Pacientes',
      path: '/Inicio/pacientes',
    },
    {
      icon: <Table size={24} className={styles.icon} weight="fill" />,
      text: 'Tabla de Citas',
      path: '/Inicio/citas',
    },
    {
      icon: <FileDoc size={24} className={styles.icon} weight="fill" />,
      text: 'Reportes',
      path: '/Inicio/reportes',
    },
    {
      icon: <Table size={24} className={styles.icon} weight="fill" />,
      text: 'Tabla de Terapeutas',
      path: '/Inicio/terapeutas',
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div 
      className={styles.container}
      style={{
        backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
        boxShadow: isDarkMode 
          ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
          : '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      <h2 className={styles.title}>Accesos Rápidos</h2>
      <div className={styles.grid}>
        {quickLinks.map((link, index) => (
          <button
            key={index}
            className={styles.card}
            onClick={() => handleNavigation(link.path)}
            style={{
              backgroundColor: isDarkMode ? '#333333' : '#f8f9fa',
              color: isDarkMode ? '#ffffff' : '#333333',
              border: `1px solid ${isDarkMode ? '#444444' : '#e0e0e0'}`
            }}
          >
            {link.icon}
            <span>{link.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;
