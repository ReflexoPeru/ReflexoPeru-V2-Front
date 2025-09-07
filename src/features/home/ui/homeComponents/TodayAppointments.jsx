import React from 'react';
import styles from './TodayAppointments.module.css';
import { CheckCircle } from '@phosphor-icons/react';
import { useTodayAppointments } from '../../hook/homeHook';
import { Spin } from 'antd';
import { useTheme } from '../../../../context/ThemeContext';

const TodayAppointments = () => {
  const { appointments, loading } = useTodayAppointments();
  const { isDarkMode } = useTheme();

  return (
    <div 
      className={styles.container}
      style={{
        backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
        boxShadow: isDarkMode 
          ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
          : '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      <h2 className={styles.title}>Citas para hoy</h2>
      <div className={styles.scrollArea}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin
              size="large"
              style={{ 
                color: '#1CB54A',
                fontSize: '16px',
                fontFamily: 'var(--font-family)'
              }}
              tip="Cargando citas de hoy..."
            />
          </div>
        ) : appointments.length > 0 ? (
          appointments.map((appt, index) => (
            <div
              key={`${appt.details.id}-${index}`}
              className={styles.appointment}
            >
              <div className={styles.appointmentContent}>
                <div className={styles.name}>{appt.name}</div>
                <div className={styles.details}></div>
              </div>
              <div className={styles.check}>
                <CheckCircle size={22} />
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              color: isDarkMode ? '#ffffff' : '#333333',
              padding: '32px 16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
              borderRadius: '12px',
              margin: '16px',
              border: `1px solid ${isDarkMode ? '#444' : '#e0e0e0'}`,
              minHeight: '150px',
              justifyContent: 'center',
              fontFamily: 'var(--font-family)',
              transition: 'all var(--transition-normal)'
            }}
          >
            <CheckCircle 
              size={48} 
              color="#1CB54A" 
              style={{ 
                opacity: 0.8,
                filter: 'drop-shadow(0 2px 4px rgba(28, 181, 74, 0.2))'
              }} 
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                margin: 0,
                color: isDarkMode ? '#ffffff' : '#333333'
              }}>
                No hay citas para hoy
              </h3>
              
              <p style={{ 
                fontSize: '14px', 
                color: isDarkMode ? '#a0a0a0' : '#666666',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Las citas programadas para hoy aparecerán aquí
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TodayAppointments);
