import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarOverrides.css';
import styles from './Calendar.module.css';
import { Modal } from 'antd';
import { mockEvents } from '../../../mock/mockEvents';
import dayjs from 'dayjs';

// Localización en español
moment.locale('es', {
  months:
    'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
      '_',
    ),
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split(
    '_',
  ),
});

const localizer = momentLocalizer(moment);

const Calendario = () => {
  const [events] = React.useState(mockEvents);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [date, setDate] = React.useState(new Date());
  const [view, setView] = React.useState('month');

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#4CAF50',
      color: 'white',
      borderRadius: '4px',
      border: 'none',
    },
  });

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.mainContent}>
        <div className={styles.calendarWrapper}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            date={date}
            onNavigate={handleNavigate}
            view={view}
            onView={handleViewChange}
            messages={{
              today: 'Hoy',
              previous: 'Anterior',
              next: 'Siguiente',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
              date: 'Fecha',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'No hay citas en este rango de fechas.',
            }}
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
          />
        </div>
      </div>

      <Modal
        title="Detalles de la Cita"
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        maskClosable={true}
      >
        {selectedEvent && (
          <div style={{ color: 'black' }}>
            <p>
              <strong>Paciente:</strong> {selectedEvent.details.paciente}
            </p>
            <p>
              <strong>Tipo:</strong> {selectedEvent.details.tipo}
            </p>
            <p>
              <strong>Sala:</strong> {selectedEvent.details.sala}
            </p>
            <p>
              <strong>Fecha:</strong>{' '}
              {dayjs(selectedEvent.start).format('DD/MM/YYYY')}
            </p>
            <p>
              <strong>Hora:</strong>{' '}
              {dayjs(selectedEvent.start).format('HH:mm')} -{' '}
              {dayjs(selectedEvent.end).format('HH:mm')}
            </p>
            <p>
              <strong>Estado:</strong> {selectedEvent.details.estado}
            </p>
            <p>
              <strong>Observaciones:</strong>{' '}
              {selectedEvent.details.observaciones}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Calendario;
