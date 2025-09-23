import { useState, useEffect } from 'react';
import {
  getStaff,
  searchStaff,
  getPatientHistoryById,
  getAppointmentsByPatientId,
  updatePatientHistoryById,
  updateAppointmentById,
  createPatientHistory,
} from '../service/historyService';
import { message } from 'antd';
import { defaultConfig } from '../../../services/toastify/toastConfig';
import { useToast } from '../../../services/toastify/ToastContext';

//DATOS DEL PACIENTE -----------------------------
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
      const response = await getPatientHistoryById(patientId);
      // Si el backend responde sin data válida y aún no creamos, auto-crear
      const hasHistory = Boolean(response?.data?.id);
      const saysNotFound = typeof response?.message === 'string' && response.message.toLowerCase().includes('no se encontró historial');
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
          // Si falla la creación, al menos setear el response inicial
          setData(response);
        }
      } else {
        setData(response);
      }
    } catch (err) {
      // Si el back respondió 404 o mensaje de no encontrado, intentar crear una vez
      const backendMsg = err?.response?.data?.message || '';
      const notFound = typeof backendMsg === 'string' && backendMsg.toLowerCase().includes('no se encontró historial');
      if (!autoCreated && notFound) {
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

//ACTUALIZAR DATOS DE HISTORIA DEL PACIENTE
export const useUpdatePatientHistory = (patientId, onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const updateHistory = async (historyId, data) => {
    setLoading(true);
    try {
      // Si no hay historyId, crear primero para habilitar el flujo
      if (!historyId) {
        const creationPayload = {
          patient_id: patientId,
          // Crear con valores nulos; luego se actualizará con PATCH
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
      // Asegurar booleans y números correctos antes de enviar
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
      
      // Llamar callback de éxito si existe
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

//DATOS DEL PERSONAL PARA EL MODAL------------------------------
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
      console.error('Error loading staff:', error);
      showToast('error');
    } finally {
      setLoading(false);
    }
  };

  const searchStaffByTerm = async (term) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, total } = await searchStaff(term);
      setStaff(data);
      setPagination({
        currentPage: 1,
        totalItems: total,
      });
    } catch (error) {
      setError(error.message);
      console.error('Error searching staff:', error);
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
        searchStaffByTerm(searchTerm.trim());
      } else {
        loadStaff(1);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, initialLoad]);

  return {
    staff,
    loading,
    error,
    pagination,
    setSearchTerm,
    handlePageChange: loadStaff,
  };
};

// DATOS DE LAS CITAS DEL PACIENTE -----------------------------
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
      // Ordenar citas por fecha descendente
      const sortedAppointments = [...response].sort(
        (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date),
      );
      setAppointments(sortedAppointments);
      // Establecer la última cita (primera del array ordenado)
      setLastAppointment(sortedAppointments[0] || null);
      setError(null);
      showToast('busquedaPaciente');
    } catch (error) {
      console.error('Error al cargar las citas del paciente:', error);
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

// ACTUALIZAR DATOS DE LAS CITAS DEL PACIENTE -----------------------------
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
