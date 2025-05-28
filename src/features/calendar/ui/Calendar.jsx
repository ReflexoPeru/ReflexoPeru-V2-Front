import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarOverrides.css';
import styles from './Calendar.module.css';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import { useCalendar } from '../hook/calendarHook';

// Localización en español
moment.locale('es', {
  months:
    'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
      '_',
    ),
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
});

const localizer = momentLocalizer(moment);

const Calendario = () => {
  const { events, loading, error } = useCalendar();
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

  // Función para mapear el estado de la cita
  const getAppointmentStatus = (statusId) => {
    switch (statusId) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Confirmada';
      case 3:
        return 'Completada';
      case 4:
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  // Función para mapear el tipo de pago
  const getPaymentType = (typeId) => {
    switch (typeId) {
      case 1:
        return 'Efectivo';
      case 2:
        return 'Tarjeta';
      case 3:
        return 'Transferencia';
      default:
        return 'Desconocido';
    }
  };

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>Error al cargar eventos: {error.message}</p>;

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
        width={600}
      >
        {selectedEvent && (
          <div style={{ color: 'black' }}>
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
              <strong>Tipo de cita:</strong> {selectedEvent.title}
            </p>
            <p>
              <strong>Malestar:</strong>{' '}
              {selectedEvent.details.ailments || 'No especificado'}
            </p>
            <p>
              <strong>Diagnóstico reflexológico:</strong>{' '}
              {selectedEvent.details.reflexology_diagnostics ||
                'No especificado'}
            </p>
            <p>
              <strong>Observaciones:</strong>{' '}
              {selectedEvent.details.observation || 'Ninguna'}
            </p>
            <p>
              <strong>Estado:</strong>{' '}
              {getAppointmentStatus(
                selectedEvent.details.appointment_status_id,
              )}
            </p>
            <p>
              <strong>Tipo de pago:</strong>{' '}
              {getPaymentType(selectedEvent.details.payment_type_id)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Calendario;
