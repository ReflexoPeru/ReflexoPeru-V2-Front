import { get, patch } from '../../../services/api/Axios/MethodsGeneral';

/**
 * API para gestión de citas
 * Maneja todas las operaciones relacionadas con appointments
 */

/**
 * Obtiene todas las citas de un paciente
 * @param {number} patientId - ID del paciente
 * @returns {Promise<Object>} Objeto con appointments (array) y patient (object)
 */
export const getAppointmentsByPatientId = async (patientId) => {
  if (!patientId) {
    throw new Error('Patient ID is required');
  }

  try {
    const response = await get(`patients/appoiments/${patientId}`);
    // Nueva estructura: { appointments: [...], patient: {...} }
    return response.data || { appointments: [], patient: null };
  } catch (error) {
    console.error('[appointmentApi] Error fetching appointments:', error);
    throw error;
  }
};

/**
 * Actualiza una cita existente
 * @param {number} appointmentId - ID de la cita
 * @param {Object} payload - Datos a actualizar
 * @returns {Promise<Object>} Cita actualizada
 */
export const updateAppointmentById = async (appointmentId, payload) => {
  if (!appointmentId) {
    throw new Error('Appointment ID is required');
  }

  try {
    const response = await patch(`appointments/${appointmentId}`, payload);
    return response.data;
  } catch (error) {
    console.error('[appointmentApi] Error updating appointment:', error);
    throw error;
  }
};

/**
 * Ordena las citas por fecha descendente (más reciente primero)
 * @param {Array} appointments - Lista de citas
 * @returns {Array} Citas ordenadas
 */
export const sortAppointmentsByDate = (appointments) => {
  if (!Array.isArray(appointments)) {
    return [];
  }

  return [...appointments].sort(
    (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
  );
};

/**
 * Extrae fechas únicas de las citas
 * @param {Array} appointments - Lista de citas
 * @returns {Array<string>} Fechas únicas
 */
export const extractUniqueDates = (appointments) => {
  if (!Array.isArray(appointments)) {
    return [];
  }

  return [...new Set(appointments.map((a) => a.appointment_date))];
};

/**
 * Encuentra una cita por fecha
 * @param {Array} appointments - Lista de citas
 * @param {string} date - Fecha a buscar
 * @returns {Object|null} Cita encontrada o null
 */
export const findAppointmentByDate = (appointments, date) => {
  if (!Array.isArray(appointments) || !date) {
    return null;
  }

  return appointments.find((a) => a.appointment_date === date) || null;
};

/**
 * Obtiene la última cita (más reciente)
 * @param {Array} appointments - Lista de citas
 * @returns {Object|null} Última cita o null
 */
export const getLastAppointment = (appointments) => {
  if (!Array.isArray(appointments) || appointments.length === 0) {
    return null;
  }

  const sorted = sortAppointmentsByDate(appointments);
  return sorted[0] || null;
};


