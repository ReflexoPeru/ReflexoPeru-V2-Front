import { useEffect, useState, useCallback, useRef } from 'react';
import dayjs from '../../../utils/dayjsConfig';
import {
  getPaginatedAppointmentsCompleteByDate,
  searchAppointmentsComplete,
} from '../service/appointmentsCompleteService';

export const useAppointmentsComplete = () => {
  const [appointmentsComplete, setAppointmentsComplete] = useState([]);
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

  const loadAppointmentsComplete = useCallback(async () => {
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
        response = await searchAppointmentsComplete(searchTerm, { signal });
      } else {
        response = await getPaginatedAppointmentsCompleteByDate(
          selectedDate,
          pagination.pageSize,
          pagination.currentPage,
          { signal },
        );
      }

      setAppointmentsComplete(response.data || []);
      setPagination((prev) => ({
        ...prev,
        currentPage: response.currentPage || 1,
        totalItems: response.total || 0,
        pageSize: response.perPage || prev.pageSize,
      }));
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error);
        setAppointmentsComplete([]);
        setPagination((prev) => ({ ...prev, totalItems: 0 }));
      }
    } finally {
      abortControllerRef.current = null;
      setLoading(false);
    }
  }, [searchTerm, selectedDate, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadAppointmentsComplete();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadAppointmentsComplete]);

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

  const loadPaginatedAppointmentsCompleteByDate = useCallback(
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
    appointmentsComplete,
    loading,
    error,
    pagination,
    selectedDate,
    searchTerm,

    loadAppointmentsComplete,
    handleDateChange,
    handleSearch,
    handlePageChange,
    loadPaginatedAppointmentsCompleteByDate,
    setSearchTerm,
    setSelectedDate,
    setPagination,
  };
};
