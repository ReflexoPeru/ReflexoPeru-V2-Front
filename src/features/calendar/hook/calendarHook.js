// hooks/useCitas.js
import { useEffect, useState } from 'react';
import { createPatient } from '../services/citaService';

export const useCitas = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const data = await createPatient();

        // Transformamos las citas para el React Big Calendar
        const formattedEvents = data.map((cita) => ({
          id: cita.id,
          title: cita.details?.paciente || 'Cita',
          start: new Date(cita.start),
          end: new Date(cita.end),
          details: {
            paciente: cita.details?.paciente || 'Desconocido',
            tipo: cita.details?.tipo || 'N/A',
            sala: cita.details?.sala || 'N/A',
            estado: cita.details?.estado || 'N/A',
            observaciones: cita.details?.observaciones || '',
          },
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error al obtener datos de calendario :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  return { events, loading };
};
