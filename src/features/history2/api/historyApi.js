import { get, patch } from '../../../services/api/Axios/MethodsGeneral';

/**
 * API para gestión de historias clínicas
 * Separa las responsabilidades de la capa de servicios
 */

/**
 * Obtiene el historial de un paciente por su ID
 * @param {number} patientId - ID del paciente
 * @returns {Promise<Object>} Historial del paciente
 */
export const getPatientHistoryById = async (patientId) => {
  if (!patientId) {
    throw new Error('Patient ID is required');
  }

  try {
    const response = await get(`histories/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('[historyApi] Error fetching patient history:', error);
    throw error;
  }
};

/**
 * Obtiene un historial por su ID directo
 * @param {number} historyId - ID del historial
 * @returns {Promise<Object>} Historial
 */
export const getHistoryById = async (historyId) => {
  if (!historyId) {
    throw new Error('History ID is required');
  }

  try {
    const response = await get(`histories/${historyId}`);
    return response.data;
  } catch (error) {
    console.error('[historyApi] Error fetching history by ID:', error);
    throw error;
  }
};

/**
 * NOTA: El backend crea automáticamente el historial cuando es necesario
 * Esta función ya no se usa en el frontend
 * 
 * Crea un nuevo historial para un paciente
 * @param {Object} data - Datos del historial
 * @returns {Promise<Object>} Historial creado
 */
/* export const createPatientHistory = async (data) => {
  if (!data.patient_id) {
    throw new Error('Patient ID is required to create history');
  }

  try {
    const response = await post('histories', data);
    return response.data;
  } catch (error) {
    console.error('[historyApi] Error creating patient history:', error);
    throw error;
  }
}; */

/**
 * Actualiza un historial existente
 * @param {number} historyId - ID del historial a actualizar
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Historial actualizado
 */
export const updatePatientHistoryById = async (historyId, data) => {
  if (!historyId) {
    throw new Error('History ID is required to update');
  }

  try {
    const response = await patch(`histories/${historyId}`, data);
    return response.data;
  } catch (error) {
    console.error('[historyApi] Error updating patient history:', error);
    throw error;
  }
};

/**
 * Verifica si un historial existe y tiene datos válidos
 * @param {Object} historyResponse - Respuesta del API
 * @returns {boolean} true si el historial existe y es válido
 */
export const isValidHistory = (historyResponse) => {
  if (!historyResponse?.data?.id) {
    return false;
  }

  // Verifica que tenga al menos algún dato relevante
  const hasData = Boolean(
    historyResponse.data.height ||
    historyResponse.data.weight ||
    historyResponse.data.last_weight ||
    historyResponse.data.observation
  );

  return hasData;
};

/**
 * NOTA: El backend crea automáticamente el historial cuando es necesario
 * Esta función ya no se usa en el frontend
 * 
 * Construye el payload inicial para crear un historial vacío
 * @param {number} patientId - ID del paciente
 * @returns {Object} Payload para crear historial
 */
/* export const buildEmptyHistoryPayload = (patientId) => ({
  patient_id: patientId,
  testimony: null,
  private_observation: null,
  observation: null,
  height: '',
  weight: '',
  last_weight: null,
  current_weight: null,
  menstruation: null,
  diu_type: null,
  gestation: null,
  use_contraceptive_method: null,
  contraceptive_method_id: null,
  diu_type_id: null,
  therapist_id: null,
}); */

