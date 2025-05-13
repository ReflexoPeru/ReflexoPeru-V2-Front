import React, { useState, useEffect } from 'react';
import { Layout, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { CaretLeft, ArrowLeft } from '@phosphor-icons/react';
import styles from './Header.module.css';

dayjs.locale('es');

const { Header } = Layout;
const { Text } = Typography;

const CustomHeader = ({ title }) => {
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

  return (
    <Header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton}>
            <ArrowLeft size={20} weight="bold" />
          </button>
          <Text className={styles.headerTitle}>{title || ''}</Text>
        </div>
        <div className={styles.headerRight}>
          <Text className={styles.headerTime}>{currentTime}</Text>
          <Text className={styles.headerDate}>{currentDate}</Text>
        </div>
      </div>
    </Header>
  );
};

export default CustomHeader;
