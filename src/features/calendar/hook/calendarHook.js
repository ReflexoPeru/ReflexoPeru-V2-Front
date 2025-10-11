import { useState, useEffect } from 'react';
import {
  getPendingAppointments,
  getPaginatedAppointments,
  getPaginatedAppointmentsRange,
  getCompletedAppointmentsRange,
} from '../service/calendarService';
import dayjs from '../../../utils/dayjsConfig';

export const useCalendar = (currentDate = new Date(), view = 'month') => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async (date = currentDate, currentView = view) => {
    setLoading(true);
    setError(null);
    try {
      const currentDay = dayjs(date);
      let startDate, endDate;
      
      switch (currentView) {
        case 'month':
          startDate = currentDay.startOf('month').format('YYYY-MM-DD');
          endDate = currentDay.endOf('month').format('YYYY-MM-DD');
          break;
        case 'week':
        case 'agenda':
          startDate = currentDay.startOf('week').add(1, 'day').format('YYYY-MM-DD');
          endDate = currentDay.startOf('week').add(6, 'day').format('YYYY-MM-DD');
          break;
        case 'day':
          startDate = currentDay.format('YYYY-MM-DD');
          endDate = currentDay.add(1, 'day').format('YYYY-MM-DD');
          break;
        default:
          startDate = currentDay.startOf('month').format('YYYY-MM-DD');
          endDate = currentDay.endOf('month').format('YYYY-MM-DD');
      }
      
      
      const pendingPromise = getPendingAppointments();
      const completedPromise = getCompletedAppointmentsRange(startDate, endDate, 100, 1);
      const [pendingData, completedData] = await Promise.all([
        pendingPromise,
        completedPromise,
      ]);

      

      let pendingEvents = [];
      if (Array.isArray(pendingData)) {
        const eventsByDate = {};
        pendingData.forEach(item => {
          const appointmentDate = item.appointment_date ? item.appointment_date.split(' ')[0] : '';
          if (!eventsByDate[appointmentDate]) {
            eventsByDate[appointmentDate] = [];
          }
          eventsByDate[appointmentDate].push(item);
        });

        Object.keys(eventsByDate).forEach(dateKey => {
          const dateEvents = eventsByDate[dateKey];
          dateEvents.forEach((item, index) => {
          try {
            let appointmentHour = item.appointment_hour;
            if (!appointmentHour) {
              const availableHours = [7, 8, 9, 10, 11, 12];
              const hourIndex = index % availableHours.length;
              const selectedHour = availableHours[hourIndex];
              appointmentHour = `${selectedHour.toString().padStart(2, '0')}:00:00`;
            }
            
            const appointmentDate = item.appointment_date ? item.appointment_date.split(' ')[0] : '';
            const start = dayjs(
              `${appointmentDate}T${appointmentHour || '09:00:00'}`,
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
            
            const patientLastNames = item.patient 
              ? `${item.patient.paternal_lastname || ''} ${item.patient.maternal_lastname || ''}`.trim()
              : 'Paciente';

            
            const event = {
              id: item.id,
              title: patientLastNames || item.appointment_type || 'Cita',
              start: start.toDate(),
              end: end.toDate(),
              resource: 'PENDIENTE',
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
                appointment_status_id: 'PENDIENTE',
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
            pendingEvents.push(event);
          } catch (error) {
            console.error('Error mapeando evento pendiente:', error, item);
          }
        });
        });
      }

      let completedEvents = [];
      if (Array.isArray(completedData?.data)) {
        const eventsByDate = {};
        completedData.data.forEach(item => {
          const appointmentDate = item.appointment_date ? item.appointment_date.split(' ')[0] : '';
          if (!eventsByDate[appointmentDate]) {
            eventsByDate[appointmentDate] = [];
          }
          eventsByDate[appointmentDate].push(item);
        });

        Object.keys(eventsByDate).forEach(dateKey => {
          const dateEvents = eventsByDate[dateKey];
          dateEvents.forEach((item, index) => {
          try {
            const appointmentDate = item.appointment_date ? item.appointment_date.split(' ')[0] : '';
            
            let appointmentHour;
            if (item.appointment_hour) {
              appointmentHour = item.appointment_hour;
            } else {
              const availableHours = [7, 8, 9, 10, 11, 12];
              const hourIndex = index % availableHours.length;
              const selectedHour = availableHours[hourIndex];
              appointmentHour = `${selectedHour.toString().padStart(2, '0')}:00:00`;
            }
            
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
            
            const patientLastNames = item.patient 
              ? `${item.patient.paternal_lastname || ''} ${item.patient.maternal_lastname || ''}`.trim()
              : 'Paciente';
            
            
            const event = {
              id: item.id,
              title: patientLastNames || 'Cita',
              start: start.toDate(),
              end: end.toDate(),
              resource: 'COMPLETADO',
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
                appointment_status_id: 'COMPLETADO',
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
            completedEvents.push(event);
          } catch (error) {
            console.error('Error mapeando evento completado:', error, item);
          }
          });
        });
      }

      const allEvents = [...pendingEvents, ...completedEvents];
      setEvents(allEvents);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentDate, view);
  }, [currentDate, view]);

  return { events, loading, error, fetchEvents };
};
