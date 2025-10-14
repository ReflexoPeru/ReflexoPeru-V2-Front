import { useState, useEffect, useRef } from 'react';
import { getTherapists, searchTherapists } from '../api/therapistApi';
import { useToast } from '../../../services/toastify/ToastContext';
import { UI_DELAYS, PAGINATION_CONFIG } from '../constants';

/**
 * Hook para gestionar lista de terapeutas con búsqueda y paginación
 * Simplificado para evitar loops infinitos - Patrón V1
 */
export const useTherapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: PAGINATION_CONFIG.DEFAULT_PAGE,
    totalItems: 0,
    pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
  });
  const [initialLoad, setInitialLoad] = useState(false);
  const { showToast } = useToast();

  /**
   * Carga la lista de terapeutas con paginación
   */
  const loadTherapists = async (page = PAGINATION_CONFIG.DEFAULT_PAGE) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const { data, total } = await getTherapists(page, pagination.pageSize);

      setTherapists(data);
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        totalItems: total,
      }));
    } catch (err) {
      console.error('[useTherapists] Error loading therapists:', err);
      setError(err);
      showToast('error', 'Error al cargar terapeutas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Busca terapeutas por término
   */
  const searchTherapistsByTerm = async (term, page = PAGINATION_CONFIG.DEFAULT_PAGE) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const { data, total } = await searchTherapists(
        term,
        page,
        pagination.pageSize
      );

      setTherapists(data);
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        totalItems: total,
      }));
    } catch (err) {
      console.error('[useTherapists] Error searching therapists:', err);
      setError(err);
      showToast('error', 'Error al buscar terapeutas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el cambio de página
   */
  const handlePageChange = (page) => {
    if (searchTerm.trim()) {
      searchTherapistsByTerm(searchTerm.trim(), page);
    } else {
      loadTherapists(page);
    }
  };

  /**
   * Inicializa la carga de terapeutas (llamar solo cuando se abre el modal)
   */
  const initializeLoad = () => {
    if (!initialLoad) {
      loadTherapists(PAGINATION_CONFIG.DEFAULT_PAGE);
      setInitialLoad(true);
    }
  };

  // Búsqueda con debounce - SOLO si ya se inicializó
  useEffect(() => {
    if (!initialLoad) return;

    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        searchTherapistsByTerm(searchTerm.trim(), PAGINATION_CONFIG.DEFAULT_PAGE);
      } else {
        loadTherapists(PAGINATION_CONFIG.DEFAULT_PAGE);
      }
    }, UI_DELAYS.SEARCH_DEBOUNCE);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, initialLoad]); // Solo searchTerm e initialLoad como en V1

  return {
    therapists,
    loading,
    error,
    searchTerm,
    pagination,
    handlePageChange,
    handleSearchChange: (term) => setSearchTerm(term),
    clearSearch: () => {
      setSearchTerm('');
      loadTherapists(PAGINATION_CONFIG.DEFAULT_PAGE);
    },
    initializeLoad,
    refetch: loadTherapists,
  };
};

/**
 * Hook simple para gestionar la selección de terapeuta
 */
export const useTherapistSelection = (initialTherapist = null) => {
  const [selectedTherapist, setSelectedTherapist] = useState(initialTherapist);
  const [selectedTherapistId, setSelectedTherapistId] = useState(
    initialTherapist?.id || null
  );

  const selectTherapist = (therapist) => {
    setSelectedTherapist(therapist);
    setSelectedTherapistId(therapist?.id || null);
  };

  const clearTherapist = () => {
    setSelectedTherapist(null);
    setSelectedTherapistId(null);
  };

  useEffect(() => {
    if (initialTherapist) {
      setSelectedTherapist(initialTherapist);
      setSelectedTherapistId(initialTherapist.id);
    }
  }, [initialTherapist?.id]); // Solo el ID como dependencia

  return {
    selectedTherapist,
    selectedTherapistId,
    selectTherapist,
    clearTherapist,
  };
};
