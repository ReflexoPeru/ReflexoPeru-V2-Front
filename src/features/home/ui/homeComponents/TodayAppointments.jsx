import React from 'react';
import styles from './TodayAppointments.module.css';
import { CheckCircle } from '@phosphor-icons/react';

const appointments = [
    { name: 'Teresa Mendoza', service: 'Reflexología podal', time: '13:00' },
    { name: 'Carlos Ramirez', service: 'Masaje terapéutico', time: '14:30' },
    { name: 'Ana García', service: 'Reflexología podal', time: '16:00' },
    { name: 'Pedro López', service: 'Masaje relajante', time: '17:30' },
    { name: 'María Torres', service: 'Reflexología podal', time: '18:45' },
    { name: 'Luis Pérez', service: 'Terapia de espalda', time: '20:00' }
];

const TodayAppointments = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Citas para hoy</h2>
            <div className={styles.scrollArea}>
                {appointments.map((appt, index) => (
                    <div key={index} className={styles.appointment}>
                        <div>
                            <div className={styles.name}>{appt.name}</div>
                            <div className={styles.details}>{appt.service} - {appt.time}</div>
                        </div>
                        <div className={styles.check}>
                            <CheckCircle  size={30} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodayAppointments;
