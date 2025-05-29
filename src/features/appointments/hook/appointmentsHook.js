import { useEffect, useState, useCallback, useRef } from 'react';
import dayjs from 'dayjs';
import {
  getPaginatedAppointmentsByDate,
  searchAppointments,
  createAppointment,
} from '../service/appointmentsService';

export const useAppointments = (initialDate = dayjs().format('YYYY-MM-DD')) => {
  // Estados principales
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Paginación
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    pageSize: 10,
  });

  // Referencia para evitar llamadas duplicadas
  const abortControllerRef = useRef(null);

  // Función principal para cargar citas
  const loadAppointments = useCallback(async () => {
    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoading(true);
    setError(null);

    try {
      let response;

      if (searchTerm.trim()) {
        response = await searchAppointments(searchTerm, { signal });
      } else {
        response = await getPaginatedAppointmentsByDate(
          selectedDate,
          pagination.pageSize,
          pagination.currentPage,
          { signal },
        );
      }

      setAppointments(response.data || []);
      setPagination((prev) => ({
        ...prev,
        totalItems: response.total || 0,
      }));
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error loading appointments:', error);
        setError(error);
        setAppointments([]);
        setPagination((prev) => ({ ...prev, totalItems: 0 }));
      }
    } finally {
      abortControllerRef.current = null;
      setLoading(false);
    }
  }, [searchTerm, selectedDate, pagination.currentPage, pagination.pageSize]);

  // Efecto para cargar citas con debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadAppointments();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadAppointments]);

  // Cambiar fecha seleccionada
  const handleDateChange = useCallback(
    (date) => {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      if (formattedDate !== selectedDate) {
        setSelectedDate(formattedDate);
        setSearchTerm('');
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
      }
    },
    [selectedDate],
  );

  // Cambiar término de búsqueda
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  // Cambiar página
  const handlePageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  // Crear nueva cita
  const submitNewAppointment = useCallback(
    async (appointmentData) => {
      try {
        setLoading(true);
        const payload = {
          ...appointmentData,
          appointment_date: dayjs(appointmentData.appointment_date).format(
            'YYYY-MM-DD',
          ),
          created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };

        const result = await createAppointment(payload);
        await loadAppointments(); // Recargar lista después de crear
        return result;
      } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loadAppointments],
  );
  const loadPaginatedAppointmentsByDate = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    if (formattedDate !== selectedDate || searchTerm !== '') {
      setSelectedDate(formattedDate);
      setSearchTerm('');
    }
  };
  return {
    // Estados
    appointments,
    loading,
    error,
    pagination,
    selectedDate,
    searchTerm,

    // Funciones
    loadAppointments,
    handleDateChange,
    handleSearch,
    handlePageChange,
    submitNewAppointment,
    loadPaginatedAppointmentsByDate,
    // Setters
    setSearchTerm,
    setSelectedDate,
    setPagination,
  };
};
