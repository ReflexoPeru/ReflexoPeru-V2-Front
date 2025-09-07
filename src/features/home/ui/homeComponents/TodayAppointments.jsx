import React from 'react';
import styles from './TodayAppointments.module.css';
import { CheckCircle } from '@phosphor-icons/react';
import { useTodayAppointments } from '../../hook/homeHook';
import { Spin, ConfigProvider } from 'antd';

const TodayAppointments = () => {
  const { appointments, loading } = useTodayAppointments();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Citas para hoy</h2>
      <div className={styles.scrollArea}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <ConfigProvider theme={{ token: { colorPrimary: '#22c55e' } }}>
              <Spin
                size="large"
                style={{ 
                  color: '#22c55e',
                  fontSize: '16px',
                  fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif'
                }}
                tip="Cargando citas de hoy..."
              />
            </ConfigProvider>
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
              color: '#ffffff',
              padding: '32px 16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              background: '#1e1e1e',
              borderRadius: '12px',
              margin: '16px',
              border: '1px solid #444',
              minHeight: '150px',
              justifyContent: 'center',
              fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif'
            }}
          >
            <CheckCircle 
              size={48} 
              color="#22c55e" 
              style={{ 
                opacity: 0.8,
                filter: 'drop-shadow(0 2px 4px rgba(34, 197, 94, 0.2))'
              }} 
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                margin: 0,
                color: '#ffffff'
              }}>
                No hay citas para hoy
              </h3>
              
              <p style={{ 
                fontSize: '14px', 
                color: '#a0a0a0',
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
