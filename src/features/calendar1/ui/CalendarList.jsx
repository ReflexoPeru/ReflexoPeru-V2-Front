import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, CheckSquare, XCircle } from '@phosphor-icons/react';
import styles from './CalendarList.module.css';

const CalendarList = ({ onCalendarToggle, selectedFilter }) => {
  const [selectedCalendar, setSelectedCalendar] = useState(selectedFilter || 'all');

  useEffect(() => {
    if (selectedFilter !== undefined) {
      setSelectedCalendar(selectedFilter);
    }
  }, [selectedFilter]);


  const handleSelect = (calendarType) => {
    setSelectedCalendar(calendarType);
    if (onCalendarToggle) {
      onCalendarToggle(calendarType);
    }
  };

  const calendarItems = [
    { 
      key: 'all', 
      label: 'Todos', 
      color: 'gray',
      icon: CheckSquare
    },
    { 
      key: 'PENDIENTE', 
      label: 'Pendientes', 
      color: 'yellow',
      icon: Clock
    },
    { 
      key: 'COMPLETADO', 
      label: 'Completados', 
      color: 'green',
      icon: CheckCircle
    }
  ];

  return (
    <div className={styles['calendar-list']}>
      <h3 className={styles['calendar-list__title']}>Mis calendarios</h3>
      <div className={styles['calendar-list__items']}>
        {calendarItems.map((item) => (
          <div 
            key={item.key}
            className={`${styles['calendar-list__item']} ${styles[`calendar-list__item--${item.color}`]} ${
              selectedCalendar === item.key ? styles['calendar-list__item--checked'] : ''
            }`}
            onClick={() => handleSelect(item.key)}
          >
            <div className={styles['calendar-list__checkbox-container']}>
              <input
                type="radio"
                id={`calendar-${item.key}`}
                name="calendar-filter"
                className={`${styles['calendar-list__checkbox']} ${styles[`calendar-list__checkbox--${item.color}`]}`}
                checked={selectedCalendar === item.key}
                onChange={() => handleSelect(item.key)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className={`${styles['calendar-list__custom-checkbox']} ${styles[`calendar-list__custom-checkbox--${item.color}`]}`}>
                {selectedCalendar === item.key && (
                  <span className={styles['calendar-list__checkmark']}>✓</span>
                )}
              </div>
            </div>
            <item.icon className={styles['calendar-list__icon']} size={16} />
            <label 
              htmlFor={`calendar-${item.key}`}
              className={styles['calendar-list__label']}
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarList;