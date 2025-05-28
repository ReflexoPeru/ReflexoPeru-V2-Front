import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  getPaginatedAppointmentsByDate,
  searchAppointments,
} from '../service/appointmentsService';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD'),
  );
  const [error, setError] = useState(null); // 👉 nuevo

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
  });

  const perPage = 100;

  const loadAppointments = async (
    date = selectedDate,
    term = searchTerm,
    page = pagination.currentPage,
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (term) {
        const res = await searchAppointments(term);
        setAppointments(res.data);
        setPagination({ currentPage: 1, totalItems: res.total });
      } else {
        const res = await getPaginatedAppointmentsByDate(date, perPage);
        setAppointments(res.data);
        setPagination({ currentPage: page, totalItems: res.total });
      }
    } catch (error) {
      console.error('❌ Error al cargar citas:', error);
      setAppointments([]);
      setPagination({ currentPage: 1, totalItems: 0 });
      setError(error); // 👉 nuevo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [searchTerm, selectedDate]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSearchTerm('');
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    loadAppointments(selectedDate, searchTerm, page);
  };

  const loadPaginatedAppointmentsByDate = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    if (formattedDate !== selectedDate || searchTerm !== '') {
      setSelectedDate(formattedDate);
      setSearchTerm('');
    }
  };

  const submitNewAppointment = async () => {
    const payload = {
      appointment_date: format(new Date(), 'yyyy-MM-dd'), // Fecha actual
      appointment_hour: '04:00',
      patient_id: 2,
      therapist_id: 3,
      payment: '50.00',
      appointment_type: 'Terapia individual',
      social_benefit: false,
      appointment_status_id: null,
      payment_type_id: null,
      final_date: null,
    };

    try {
      const result = await createAppointment(payload);
      console.log('Cita creada correctamente:', result);
      return result;
    } catch (error) {
      console.error('Error al crear la cita:', error.response?.data || error);
      throw error;
    }
  };

  return {
    appointments,
    totalAppointments,
    loading,
    error,
    pagination,
    handleSearch,
    handleDateChange,
    handlePageChange,
    setSearchTerm, // 👉 añadido
    loadPaginatedAppointmentsByDate,
    submitNewAppointment, // 👉 añadido
  };
};
