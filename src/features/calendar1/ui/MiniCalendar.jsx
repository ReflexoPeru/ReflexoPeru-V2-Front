import React, { useState } from 'react';
import dayjs from '../../../utils/dayjsConfig';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import styles from './MiniCalendar.module.css';

const MiniCalendar = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs(selectedDate || new Date()));

  const startOfMonth = currentMonth.startOf('month');
  const endOfMonth = currentMonth.endOf('month');
  const startOfWeek = startOfMonth.startOf('week');
  const endOfWeek = endOfMonth.endOf('week');

  const days = [];
  let day = startOfWeek;

  while (day.isSameOrBefore(endOfWeek)) {
    days.push(day);
    day = day.add(1, 'day');
  }

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const handleDateClick = (date) => {
    if (onDateChange) {
      onDateChange(date.toDate());
    }
  };

  const isToday = (date) => {
    return dayjs().isSame(date, 'day');
  };

  const isSelected = (date) => {
    return selectedDate && dayjs(selectedDate).isSame(date, 'day');
  };

  const isCurrentMonth = (date) => {
    return currentMonth.isSame(date, 'month');
  };

  return (
    <div className={styles['mini-calendar']}>
      <div className={styles['mini-calendar-header']}>
        <button 
          className={styles['mini-calendar-nav-btn']} 
          onClick={handlePrevMonth}
        >
          <CaretLeft size={16} />
        </button>
        <h3 className={styles['mini-calendar-title']}>
          {currentMonth.format('MMMM YYYY')}
        </h3>
        <button 
          className={styles['mini-calendar-nav-btn']} 
          onClick={handleNextMonth}
        >
          <CaretRight size={16} />
        </button>
      </div>

      <div className={styles['mini-calendar-weekdays']}>
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
          <div key={index} className={styles['mini-calendar-weekday']}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles['mini-calendar-days']}>
        {days.map((date, index) => (
          <button
            key={index}
            className={`${styles['mini-calendar-day']} ${
              !isCurrentMonth(date) ? styles['mini-calendar-day-other-month'] : ''
            } ${
              isToday(date) ? styles['mini-calendar-day-today'] : ''
            } ${
              isSelected(date) ? styles['mini-calendar-day-selected'] : ''
            }`}
            onClick={() => handleDateClick(date)}
          >
            {date.format('D')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;