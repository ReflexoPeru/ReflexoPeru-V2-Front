import React from 'react';
import { Switch, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={styles.themeToggleContainer}>
      <Tooltip 
        title={isDarkMode ? 'Tema claro' : 'Tema oscuro'}
        placement="bottomRight"
        mouseEnterDelay={0.5}
      >
        <div className={styles.toggleWrapper}>
          <SunOutlined 
            className={`${styles.icon} ${styles.sunIcon} ${!isDarkMode ? styles.active : ''}`} 
          />
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            className={styles.switch}
            size="default"
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
          <MoonOutlined 
            className={`${styles.icon} ${styles.moonIcon} ${isDarkMode ? styles.active : ''}`} 
          />
        </div>
      </Tooltip>
    </div>
  );
};

export default ThemeToggle;
