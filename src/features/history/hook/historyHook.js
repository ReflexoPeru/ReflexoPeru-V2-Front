import { useState, useEffect } from 'react';
import {
  getStaff,
  searchStaff,
  getPatientHistoryById,
  getHistoryById,
  getAppointmentsByPatientId,
  updatePatientHistoryById,
  updateAppointmentById,
  createPatientHistory,
} from '../service/historyService';
import { message } from 'antd';
import { defaultConfig } from '../../../services/toastify/toastConfig';
import { useToast } from '../../../services/toastify/ToastContext';

export const usePatientHistory = (patientId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const [autoCreated, setAutoCreated] = useState(false);

  const fetchData = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      // ========================================
      // FLUJO MEJORADO Y OPTIMIZADO
      // ========================================
      // PASO 1: SIEMPRE intentar obtener el historial por patient_id primero
      // Este endpoint devuelve el historial Y el objeto patient anidado
      // Endpoint: histories/patient/{id}
      const response = await getPatientHistoryById(patientId);
      const hasHistory = Boolean(response?.data?.id);
      const hasValidData = response?.data?.height || response?.data?.weight || response?.data?.last_weight;
      const saysNotFound = typeof response?.message === 'string' && response.message.toLowerCase().includes('no se encontró historial');
      
      // CASO A: Si tiene historial con datos válidos, usarlo directamente
      if (hasHistory && hasValidData) {
        setData(response);
        setError(null);
        setLoading(false);
        return;
      }
      
      // CASO B: Si tiene historial pero sin datos (talla/pesos null)
      // O si no tiene historial, buscar en las citas por si hay un history_id
      if (hasHistory && !hasValidData || !hasHistory || saysNotFound) {
        try {
          const appointments = await getAppointmentsByPatientId(patientId);
          
          // Si hay citas con history_id, obtener ese historial específico
          if (appointments && appointments.length > 0 && appointments[0].history_id) {
            const historyId = appointments[0].history_id;
            const historyFromAppointment = await getHistoryById(historyId);
            
            // Obtener el terapeuta desde las citas
            const therapist = appointments[0].therapist || null;
            
            // Si este historial tiene el objeto patient anidado, usarlo
            // Si no, usar el patient del response anterior (si existe)
            const patientData = historyFromAppointment.patient || response?.data?.patient || null;
            
            setData({
              data: {
                ...historyFromAppointment,
                patient: patientData,
                therapist: therapist
              },
              message: 'Historial obtenido exitosamente'
            });
            setError(null);
            setLoading(false);
            return;
          }
        } catch (appointmentErr) {
          console.warn('No se pudieron obtener las citas:', appointmentErr);
          // Continuar con el flujo normal
        }
      }
      
      // CASO C: No hay historial en absoluto, crear uno nuevo
      if (!hasHistory && !autoCreated && saysNotFound) {
        const creationPayload = {
          testimony: null,
          private_observation: null,
          observation: null,
          height: '',
          weight: '',
          last_weight: null,
          menstruation: null,
          diu_type: null,
          gestation: null,
          patient_id: patientId,
        };
        try {
          await createPatientHistory(creationPayload);
          setAutoCreated(true);
          const afterCreate = await getPatientHistoryById(patientId);
          setData(afterCreate);
        } catch (e) {
          // Si falla la creación, usar la respuesta inicial
          setData(response);
        }
      } else {
        // Usar la respuesta inicial si existe
        setData(response);
      }
      
    } catch (err) {
      const backendMsg = err?.response?.data?.message || '';
      const notFound = typeof backendMsg === 'string' && backendMsg.toLowerCase().includes('no se encontró historial');
      
      if (!autoCreated && notFound) {
        // Último recurso: crear historial nuevo
        try {
          const creationPayload = {
            testimony: null,
            private_observation: null,
            observation: null,
            height: '',
            weight: '',
            last_weight: null,
            menstruation: null,
            diu_type: null,
            gestation: null,
            patient_id: patientId,
          };
          await createPatientHistory(creationPayload);
          setAutoCreated(true);
          const afterCreate = await getPatientHistoryById(patientId);
          setData(afterCreate);
        } catch (e) {
          setError(err);
        }
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [patientId]);

  return { data, loading, error, refetch: fetchData };
};

export const useHistoryById = (historyId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchData = async () => {
    if (!historyId) return;

    setLoading(true);
    try {
      const response = await getHistoryById(historyId);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err);
      const backendMsg = err?.response?.data?.message || 'Error al obtener la historia';
      showToast('error', backendMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [historyId]);

  return { data, loading, error, refetch: fetchData };
};

export const useUpdatePatientHistory = (patientId, onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const updateHistory = async (historyId, data) => {
    setLoading(true);
    try {
      if (!historyId) {
        const creationPayload = {
          patient_id: patientId,
          weight: null,
          last_weight: null,
          current_weight: null,
          height: null,
          testimony: null,
          gestation: null,
          menstruation: null,
          private_observation: null,
          observation: null,
          diagnosticos_medicos: null,
          operaciones: null,
          medicamentos: null,
          dolencias: null,
          diagnosticos_reflexologia: null,
          observaciones_adicionales: null,
          antecedentes_familiares: null,
          alergias: null,
          use_contraceptive_method: null,
          contraceptive_method_id: null,
          diu_type_id: null,
        };
        const created = await createPatientHistory(creationPayload);
        historyId = created?.data?.id || created?.id;
      }
      const normalized = {
        ...data,
        use_contraceptive_method:
          typeof data.use_contraceptive_method === 'boolean'
            ? data.use_contraceptive_method
            : data.use_contraceptive_method === 'Sí'
              ? true
              : data.use_contraceptive_method === 'No'
                ? false
                : null,
        contraceptive_method_id:
          data.use_contraceptive_method ? (data.contraceptive_method_id ?? null) : null,
        diu_type_id:
          data.use_contraceptive_method && Number(data.contraceptive_method_id) === 4
            ? (data.diu_type_id ?? null)
            : null,
      };
      await updatePatientHistoryById(historyId, normalized);
      showToast(
        'actualizarHistoria',
        'Historia clínica actualizada correctamente',
      );
      setError(null);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return {
        success: true,
        message: 'Historia clínica actualizada correctamente',
      };
    } catch (err) {
      setError(err);
      const backendMsg =
        err?.response?.data?.message ||
        'No se pudo actualizar la historia clínica. Intenta nuevamente o contacta soporte.';
      showToast('error', backendMsg);
      return { success: false, message: backendMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateHistory,
    loading,
    error,
  };
};

export const useStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [initialLoad, setInitialLoad] = useState(false);
  const { showToast } = useToast();

  const loadStaff = async (page) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, total } = await getStaff(page);
      setStaff(data);
      setPagination({
        currentPage: page,
        totalItems: total,
      });
    } catch (error) {
      setError(error.message);
      showToast('error');
    } finally {
      setLoading(false);
    }
  };

  const searchStaffByTerm = async (term, page = 1) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, total } = await searchStaff(term, page);
      setStaff(data);
      setPagination({
        currentPage: page,
        totalItems: total,
      });
    } catch (error) {
      setError(error.message);
      showToast('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoad) {
      loadStaff(1);
      setInitialLoad(true);
    }
  }, [initialLoad]);

  useEffect(() => {
    if (!initialLoad) return;

    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        searchStaffByTerm(searchTerm.trim(), 1);
      } else {
        loadStaff(1);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, initialLoad]);

  // Función unificada para manejar cambio de página
  const handlePageChange = (page) => {
    if (searchTerm.trim()) {
      searchStaffByTerm(searchTerm.trim(), page);
    } else {
      loadStaff(page);
    }
  };

  return {
    staff,
    loading,
    error,
    pagination,
    setSearchTerm,
    handlePageChange,
  };
};

export const usePatientAppointments = (patientId) => {
  const [appointments, setAppointments] = useState([]);
  const [lastAppointment, setLastAppointment] = useState(null);
  const [loadingAppointments, setLoading] = useState(false);
  const [appointmentsError, setError] = useState(null);
  const { showToast } = useToast();

  const fetchAppointments = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      const response = await getAppointmentsByPatientId(patientId);
      const sortedAppointments = [...response].sort(
        (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date),
      );
      setAppointments(sortedAppointments);
      setLastAppointment(sortedAppointments[0] || null);
      setError(null);
      showToast('busquedaPaciente');
    } catch (error) {
      setAppointments([]);
      setLastAppointment(null);
      setError(error);
      showToast('pacienteNoEncontrado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [patientId]);

  return {
    appointments,
    lastAppointment,
    loadingAppointments,
    appointmentsError,
    refetchAppointments: fetchAppointments,
  };
};

export const useUpdateAppointment = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const updateAppointment = async (appointmentId, payload) => {
    setLoading(true);
    try {
      await updateAppointmentById(appointmentId, payload);
      showToast('actualizarCita', 'Cita modificada correctamente');
      return { success: true, message: 'Cita modificada correctamente' };
    } catch (error) {
      const backendMsg =
        error?.response?.data?.message ||
        'No se pudo actualizar la cita. Por favor, revisa los datos o intenta más tarde.';
      showToast('error', backendMsg);
      return { success: false, message: backendMsg };
    } finally {
      setLoading(false);
    }
  };

  return { updateAppointment, loading };
};
