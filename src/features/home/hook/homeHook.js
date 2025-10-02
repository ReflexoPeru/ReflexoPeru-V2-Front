import { useState, useEffect } from 'react';
import { getPendingAppointments } from '../service/homeService';
import dayjs from '../../../utils/dayjsConfig';

export const useTodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodayAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingAppointments();

      if (!Array.isArray(data)) {
        setAppointments([]);
        return;
      }

      const today = dayjs().format('YYYY-MM-DD');

      const todayAppointments = data.filter(
        (item) =>
          item.appointment_date && item.appointment_date.startsWith(today),
      );

      const formattedAppointments = todayAppointments.map((item) => {
        return {
          name: item.full_name || ' ',
          service: item.appointment_type || 'Sin servicio',
          time: item.appointment_hour
            ? dayjs(item.appointment_hour, 'HH:mm:ss').format('HH:mm')
            : 'Sin hora',
          details: item,
        };
      });

      setAppointments(formattedAppointments);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  return { appointments, loading, error, refetch: fetchTodayAppointments };
};
