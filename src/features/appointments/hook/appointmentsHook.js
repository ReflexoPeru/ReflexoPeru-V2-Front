import dayjs from '../../../utils/dayjsConfig';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createAppointment,
  getAppointmentById, // Importar nueva función
  getPaginatedAppointmentsByDate,
  getPatients,
  searchAppointments,
  searchPatients,
  updateAppointment, // Importar nueva función
} from '../service/appointmentsService';
import { useToast } from '../../../services/toastify/ToastContext';
import { formatToastMessage } from '../../../utils/messageFormatter';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD'),
  );

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    pageSize: 10,
  });

  const abortControllerRef = useRef(null);

  const { showToast } = useToast();

  const loadAppointments = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

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
        currentPage: response.currentPage || 1,
        totalItems: response.total || 0,
        pageSize: response.perPage || prev.pageSize,
      }));
    } catch (error) {
      if (error.name !== 'AbortError') {
        showToast(
          'error',
          formatToastMessage(
            error.response?.data?.message,
            'Error al cargar citas',
          ),
        );
        setError(error);
        setAppointments([]);
        setPagination((prev) => ({ ...prev, totalItems: 0 }));
      }
    } finally {
      abortControllerRef.current = null;
      setLoading(false);
    }
  }, [searchTerm, selectedDate, pagination.currentPage, pagination.pageSize]);

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

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

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
        showToast('crearCita');
        await loadAppointments();
        return result;
      } catch (error) {
        showToast(
          'error',
          formatToastMessage(
            error.response?.data?.message,
            'Error creando cita',
          ),
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loadAppointments],
  );

  const getAppointmentDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointmentById(id);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExistingAppointment = useCallback(
    async (id, appointmentData) => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          ...appointmentData,
          appointment_date: dayjs(appointmentData.appointment_date).format(
            'YYYY-MM-DD',
          ),
        };
        const result = await updateAppointment(id, payload);
        showToast('actualizarCita');
        await loadAppointments();
        return result;
      } catch (err) {
        showToast(
          'error',
          formatToastMessage(
            err.response?.data?.message,
            'Error actualizando cita',
          ),
        );
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadAppointments],
  );

  const loadPaginatedAppointmentsByDate = useCallback(
    (date) => {
      const formattedDate = dayjs(date).isValid()
        ? dayjs(date).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD');

      if (formattedDate !== selectedDate || searchTerm !== '') {
        setSelectedDate(formattedDate);
        setSearchTerm('');
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
      }
    },
    [selectedDate, searchTerm],
  );

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
    getAppointmentDetails, // Exponer nueva función
    updateExistingAppointment, // Exponer nueva función
    // Setters
    setSearchTerm,
    setSelectedDate,
    setPagination,
  };
};

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [initialLoad, setInitialLoad] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients?search=${searchTerm}`);
      if (!response.ok) throw new Error('Error al obtener pacientes');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async (page) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, total } = await getPatients(page);
      setPatients(data);
      setPagination({
        currentPage: page,
        totalItems: total,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const searchPatientsByTerm = async (term) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, total } = await searchPatients(term);
      setPatients(data);
      setPagination({
        currentPage: 1,
        totalItems: total,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoad) {
      loadPatients(1);
      setInitialLoad(true);
      fetchPatients();
    }
  }, [searchTerm, initialLoad]);

  useEffect(() => {
    if (!initialLoad) return;

    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        searchPatientsByTerm(searchTerm.trim());
      } else {
        loadPatients(1);
      }
    }, 1200);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, initialLoad]);

  return {
    patients,
    loading,
    error,
    pagination,
    setSearchTerm,
    fetchPatients,
    handlePageChange: loadPatients,
  };
};
