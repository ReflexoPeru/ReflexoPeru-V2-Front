import { useState, useEffect } from 'react';
import { getPendingAppointments } from '../service/calendarService';
import dayjs from 'dayjs';

export const useCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingAppointments();

      if (!Array.isArray(data)) {
        setEvents([]);
        return;
      }

      const formattedEvents = data.map((item) => {
        const start = dayjs(
          `${item.appointment_date}T${item.appointment_hour}`,
        );
        const end = start.add(1, 'hour');

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
          },
        };
      });

      setEvents(formattedEvents);
    } catch (error) {
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
