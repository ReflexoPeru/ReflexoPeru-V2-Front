import React from 'react';
import { Switch, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.div 
      className={styles.themeToggleContainer}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Tooltip 
        title={isDarkMode ? 'Tema claro' : 'Tema oscuro'}
        placement="bottomRight"
        mouseEnterDelay={0.5}
      >
        <motion.div 
          className={styles.toggleWrapper}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <AnimatePresence mode="wait">
            {!isDarkMode ? (
              <motion.div
                key="sun"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <SunOutlined 
                  className={`${styles.icon} ${styles.sunIcon} ${styles.active}`} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <MoonOutlined 
                  className={`${styles.icon} ${styles.moonIcon} ${styles.active}`} 
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              className={styles.switch}
              size="default"
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />
          </motion.div>
          
          <AnimatePresence mode="wait">
            {isDarkMode ? (
              <motion.div
                key="moon-active"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <MoonOutlined 
                  className={`${styles.icon} ${styles.moonIcon} ${styles.active}`} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="sun-active"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <SunOutlined 
                  className={`${styles.icon} ${styles.sunIcon} ${styles.active}`} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Tooltip>
    </motion.div>
  );
};

export default ThemeToggle;
