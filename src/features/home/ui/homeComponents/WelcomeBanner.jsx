import React, { useEffect, useState } from 'react';
import styles from './WelcomeBanner.module.css';
import { HandWaving } from '@phosphor-icons/react';
import bibleVerses from '../../../../mock/bibleVerse';
import { useUser } from '../../../../context/UserContext';
import { useTheme } from '../../../../context/ThemeContext';

const getRandomVerse = () => {
  const index = Math.floor(Math.random() * bibleVerses.length);
  return bibleVerses[index];
};

const WelcomeBanner = () => {
  const [verse, setVerse] = useState('');
  const { userName } = useUser();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setVerse(getRandomVerse());
  }, []);

  return (
    <div 
      className={styles.banner}
      style={{
        backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
        boxShadow: isDarkMode 
          ? '0 0 12px rgba(0, 0, 0, 0.3)' 
          : '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      <h1 className={styles.title}>
        ¡Bienvenido a tu jornada, {userName || '...'}!
        <HandWaving color="#1CB54A" />
      </h1>
      <p className={styles.subtitle}>{verse}</p>
    </div>
  );
};

export default WelcomeBanner;
