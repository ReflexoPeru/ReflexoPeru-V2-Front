import { useState, useEffect } from 'react';
import {
  getPatientHistoryById,
  getHistoryById,
  updatePatientHistoryById,
  isValidHistory,
} from '../api/historyApi';
import {
  getAppointmentsByPatientId,
  updateAppointmentById,
  sortAppointmentsByDate,
  getLastAppointment,
} from '../api/appointmentApi';
import { useToast } from '../../../services/toastify/ToastContext';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';

/**
 * Hook principal para gestionar el historial del paciente
 * Simplificado para evitar loops infinitos
 */
export const usePatientHistory = (patientId) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchHistory = async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // INTENTO 1: Obtener historial por patient_id
      const response = await getPatientHistoryById(patientId);

      // Verificar si el historial es válido
      if (isValidHistory(response)) {
        setHistory(response);
        setError(null);
        setLoading(false);
        return;
      }

      // INTENTO 2: Obtener desde citas
      try {
        const appointmentsData = await getAppointmentsByPatientId(patientId);
        const appointments = appointmentsData?.appointments || [];

        if (appointments && appointments.length > 0 && appointments[0].history_id) {
          const historyId = appointments[0].history_id;
          const historyFromAppointment = await getHistoryById(historyId);
          const therapist = appointments[0].therapist || null;

          setHistory({
            data: {
              ...historyFromAppointment,
              therapist,
            },
            message: 'Historial obtenido desde citas',
          });
          setError(null);
          setLoading(false);
          return;
        }
      } catch (appointmentErr) {
        console.warn('[usePatientHistory] Could not get history from appointments:', appointmentErr);
      }

      // Si no se encontró historial, usar respuesta vacía
      // El backend crea automáticamente el historial cuando sea necesario
      setHistory(response);
      setError(null);
    } catch (err) {
      console.error('[usePatientHistory] Error:', err);
      
      // El backend crea automáticamente el historial si no existe
      // Solo mostramos el error sin intentar crear manualmente
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]); // Solo patientId como en V1

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
  };
};

/**
 * Hook para actualizar el historial del paciente
 */
export const useUpdatePatientHistory = (patientId, onSuccess) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const updateHistory = async (historyId, payload) => {
    setUpdating(true);
    setError(null);

    try {
      // Validar que existe historyId
      if (!historyId) {
        throw new Error('No se pudo obtener el ID del historial');
      }

      // Actualiza el historial (el backend crea automáticamente si no existe)
      await updatePatientHistoryById(historyId, payload);
      showToast('actualizarHistoria', SUCCESS_MESSAGES.HISTORY_UPDATED);

      // Ejecuta callback de éxito si existe
      if (onSuccess && typeof onSuccess === 'function') {
        await onSuccess();
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.HISTORY_UPDATED,
      };
    } catch (err) {
      console.error('[useUpdatePatientHistory] Error:', err);
      const backendMsg =
        err?.response?.data?.message || ERROR_MESSAGES.HISTORY_UPDATE_FAILED;

      setError(err);
      showToast('error', backendMsg);

      return {
        success: false,
        message: backendMsg,
      };
    } finally {
      setUpdating(false);
    }
  };

  return {
    updateHistory,
    updating,
    error,
  };
};

/**
 * Hook para gestionar las citas del paciente
 */
export const usePatientAppointments = (patientId) => {
  const [appointments, setAppointments] = useState([]);
  const [lastAppointment, setLastAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchAppointments = async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAppointmentsByPatientId(patientId);
      // Nueva estructura: { appointments: [...], patient: {...} }
      const appointmentsList = response?.appointments || [];
      const patientData = response?.patient || null;
      
      const sorted = sortAppointmentsByDate(appointmentsList);
      const last = getLastAppointment(appointmentsList);

      setAppointments(sorted);
      setLastAppointment(last);
      setPatient(patientData);
      showToast('busquedaPaciente');
    } catch (err) {
      console.error('[usePatientAppointments] Error:', err);

      setAppointments([]);
      setLastAppointment(null);
      setPatient(null);
      setError(err);
      showToast('pacienteNoEncontrado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]); // Solo patientId

  return {
    appointments,
    lastAppointment,
    patient,
    loading,
    error,
    refetch: fetchAppointments,
  };
};

/**
 * Hook para actualizar citas
 */
export const useUpdateAppointment = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const updateAppointment = async (appointmentId, payload) => {
    if (!appointmentId) {
      const error = new Error('Appointment ID is required');
      setError(error);
      return { success: false, message: 'ID de cita requerido' };
    }

    setUpdating(true);
    setError(null);

    try {
      await updateAppointmentById(appointmentId, payload);
      showToast('actualizarCita', SUCCESS_MESSAGES.APPOINTMENT_UPDATED);

      return {
        success: true,
        message: SUCCESS_MESSAGES.APPOINTMENT_UPDATED,
      };
    } catch (err) {
      console.error('[useUpdateAppointment] Error:', err);
      const backendMsg =
        err?.response?.data?.message ||
        ERROR_MESSAGES.APPOINTMENT_UPDATE_FAILED;

      setError(err);
      showToast('error', backendMsg);

      return {
        success: false,
        message: backendMsg,
      };
    } finally {
      setUpdating(false);
    }
  };

  return {
    updateAppointment,
    updating,
    error,
  };
};
