import React, { useState, useEffect } from 'react';
import { Layout, Typography } from 'antd';
import dayjs from '../../utils/dayjsConfig';
import { CaretLeft, ArrowLeft } from '@phosphor-icons/react';
import styles from './Header.module.css';
import { useNavigate } from 'react-router';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
// dayjs ya está configurado globalmente

const { Header } = Layout;
const { Text } = Typography;

const CustomHeader = ({ title, isBack = true }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm:ss'));
  const [currentDate, setCurrentDate] = useState(
    dayjs().format('dddd, D [de] MMMM [del] YYYY'),
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format('HH:mm:ss'));
      setCurrentDate(dayjs().format('dddd, D [de] MMMM [del] YYYY'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const back = () => {
    navigate(-1);
  };
  return (
    <div 
      className={styles.headerContent}
      style={{
        backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
        transition: 'all 0.3s ease',
        padding: '5px 15px',
        height: '100%'
      }}
    >
      <div className={styles.headerLeft}>
        {isBack && (
          <button 
            className={styles.backButton}
            style={{
              backgroundColor: isDarkMode ? '#333333' : '#e9ecef',
              color: isDarkMode ? '#ffffff' : '#333333',
              border: 'none'
            }}
            onClick={back}
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
        )}
        <Text 
          className={styles.headerTitle}
          style={{
            color: isDarkMode ? '#ffffff' : '#333333'
          }}
        >
          {title || ''}
        </Text>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.timeContainer}>
          <Text 
            className={styles.headerTime}
            style={{
              color: isDarkMode ? '#e5e5e7' : '#666666'
            }}
          >
            {currentTime}
          </Text>
          <Text 
            className={styles.headerDate}
            style={{
              color: isDarkMode ? '#b4b4b8' : '#999999'
            }}
          >
            {currentDate}
          </Text>
        </div>
        
        {/* Línea de separación */}
        <div 
          className={styles.separator}
          style={{
            backgroundColor: isDarkMode ? '#444444' : '#e0e0e0',
            width: '1px',
            height: '40px',
            margin: '0 16px'
          }}
        />
        
        <div 
          className={styles.themeToggleContainer}
          style={{
            backgroundColor: isDarkMode ? '#333333' : '#e9ecef',
            border: `1px solid ${isDarkMode ? '#555555' : '#dee2e6'}`
          }}
        >
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default CustomHeader;
