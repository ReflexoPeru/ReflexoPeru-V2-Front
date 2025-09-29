import { useState, useEffect } from 'react';
import {
  getPendingAppointments,
  getPaginatedAppointments,
  getPaginatedAppointmentsRange,
  getCompletedAppointmentsRange,
} from '../service/calendarService';
import dayjs from '../../../utils/dayjsConfig';

export const useCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Obtener eventos del endpoint original (pendientes)
      const pendingPromise = getPendingAppointments();
      // 2. Obtener eventos del endpoint completados para el rango de hoy a dos meses después
      const today = dayjs();
      const twoMonthsLater = today.add(2, 'month');
      const completedPromise = getCompletedAppointmentsRange(
        today.format('YYYY-MM-DD'),
        twoMonthsLater.format('YYYY-MM-DD'),
        30,
        1,
      );
      // Esperar ambas peticiones en paralelo
      const [pendingData, completedData] = await Promise.all([
        pendingPromise,
        completedPromise,
      ]);

      console.log('Datos recibidos del backend:', { pendingData, completedData });

      // Mapear eventos pendientes
      let pendingEvents = [];
      if (Array.isArray(pendingData)) {
        pendingEvents = pendingData.map((item) => {
          try {
            const start = dayjs(
              `${item.appointment_date}T${item.appointment_hour}`,
            );
            const end = start.add(1, 'hour');
            const patient_first_name = item.patient
              ? item.patient.name || ''
              : '';
            const patient_full_name = item.patient
              ? `${item.patient.name || ''} ${item.patient.paternal_lastname || ''} ${item.patient.maternal_lastname || ''}`.trim()
              : '';
            const therapist_full_name = item.therapist
              ? `${item.therapist.name || ''} ${item.therapist.paternal_lastname || ''} ${item.therapist.maternal_lastname || ''}`.trim()
              : '';
            const payment_type_name = item.payment_type
              ? item.payment_type.name
              : '';
            return {
              id: item.id,
              title: item.appointment_type,
              start: start.toDate(),
              end: end.toDate(),
              details: {
                ailments: item.ailments,
                diagnosis: item.diagnosis,
                surgeries: item.surgeries,
                reflexology_diagnostics: item.reflexology_diagnostics,
                medications: item.medications,
                observation: item.observation,
                room: item.room,
                payment: item.payment,
                ticket_number: item.ticket_number,
                appointment_status_id: item.appointment_status_id,
                payment_type_id: item.payment_type_id,
                patient_id: item.patient_id,
                therapist_id: item.therapist_id,
                created_at: item.created_at,
                updated_at: item.updated_at,
                patient_name: item.patient?.name || '',
                patient_full_name,
                patient_first_name,
                therapist_full_name,
                payment_type_name,
              },
            };
          } catch (error) {
            console.error('Error mapeando evento pendiente:', error, item);
            return null;
          }
        }).filter(Boolean);
      }

      // Mapear eventos completados
      let completedEvents = [];
      if (Array.isArray(completedData?.data)) {
        completedEvents = completedData.data.map((item) => {
          try {
            // Construir la fecha y hora correctamente
            const appointmentDate = item.appointment_date ? item.appointment_date.split(' ')[0] : '';
            const appointmentHour = item.appointment_hour || '09:00:00';
            const start = dayjs(`${appointmentDate}T${appointmentHour}`);
            const end = start.add(1, 'hour');
            
            const patient_first_name = item.patient
              ? item.patient.name || ''
              : '';
            const patient_full_name = item.patient
              ? `${item.patient.name || ''} ${item.patient.paternal_lastname || ''} ${item.patient.maternal_lastname || ''}`.trim()
              : '';
            const therapist_full_name = item.therapist
              ? `${item.therapist.name || ''} ${item.therapist.paternal_lastname || ''} ${item.therapist.maternal_lastname || ''}`.trim()
              : '';
            const payment_type_name = item.payment_type
              ? item.payment_type.name
              : '';
            
            return {
              id: item.id,
              title: item.appointment_type || 'Cita',
              start: start.toDate(),
              end: end.toDate(),
              details: {
                ailments: item.ailments,
                diagnosis: item.diagnosis,
                surgeries: item.surgeries,
                reflexology_diagnostics: item.reflexology_diagnostics,
                medications: item.medications,
                observation: item.observation,
                room: item.room,
                payment: item.payment,
                ticket_number: item.ticket_number,
                appointment_status_id: item.appointment_status_id,
                payment_type_id: item.payment_type_id,
                patient_id: item.patient_id,
                therapist_id: item.therapist_id,
                created_at: item.created_at,
                updated_at: item.updated_at,
                patient_name: item.patient?.name || '',
                patient_full_name,
                patient_first_name,
                therapist_full_name,
                payment_type_name,
              },
            };
          } catch (error) {
            console.error('Error mapeando evento completado:', error, item);
            return null;
          }
        }).filter(Boolean);
      }

      // Unir ambos orígenes de eventos
      const allEvents = [...pendingEvents, ...completedEvents];
      console.log('Eventos mapeados:', { 
        pendingEvents: pendingEvents.length, 
        completedEvents: completedEvents.length, 
        total: allEvents.length,
        sampleEvent: allEvents[0]
      });
      setEvents(allEvents);
    } catch (error) {
      console.error('Error al cargar eventos del calendario:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, fetchEvents };
};
