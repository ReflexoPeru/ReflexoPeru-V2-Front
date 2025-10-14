import { VALIDATION_MESSAGES } from '../constants';

/**
 * Validadores y reglas de formulario
 * Centraliza la lógica de validación
 */

/**
 * Regla de validación para campos numéricos
 */
export const numberValidationRule = {
  pattern: /^\d+(\.\d+)?$/,
  message: VALIDATION_MESSAGES.INVALID_NUMBER,
};

/**
 * Regla de validación para campos requeridos
 */
export const requiredValidationRule = {
  required: true,
  message: VALIDATION_MESSAGES.REQUIRED_FIELD,
};

/**
 * Validaciones para campos de peso y talla
 */
export const physicalMetricsValidation = {
  talla: [numberValidationRule],
  peso: [numberValidationRule],
};

/**
 * Valida que exista un ID de cita
 * @param {number|null} appointmentId - ID a validar
 * @returns {boolean}
 */
export const validateAppointmentId = (appointmentId) => {
  return Boolean(appointmentId);
};

/**
 * Valida que exista un ID de historial
 * @param {number|null} historyId - ID a validar
 * @returns {boolean}
 */
export const validateHistoryId = (historyId) => {
  return Boolean(historyId);
};

/**
 * Valida que un número sea positivo
 * @param {number} value - Valor a validar
 * @returns {boolean}
 */
export const isPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

/**
 * Valida que una fecha sea válida
 * @param {any} date - Fecha a validar
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  if (!date) return false;
  
  const timestamp = Date.parse(date);
  return !isNaN(timestamp);
};

/**
 * Sanitiza un string para evitar inyecciones
 * @param {string} input - String a sanitizar
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input.trim();
};

/**
 * Valida que un DNI peruano sea válido
 * @param {string} dni - DNI a validar
 * @returns {boolean}
 */
export const isValidPeruvianDNI = (dni) => {
  if (!dni) return false;
  
  const dniRegex = /^\d{8}$/;
  return dniRegex.test(dni);
};

/**
 * Valida que un email sea válido
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

