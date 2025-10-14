/**
 * Constantes para el módulo de Historia del Paciente
 * Centraliza valores mágicos para facilitar mantenimiento
 */

// IDs de métodos anticonceptivos
export const CONTRACEPTIVE_METHOD_IDS = {
  DIU: 4, // ID del método DIU en la BD
};

// Estados de cita
export const APPOINTMENT_STATUS = {
  PENDING: 1,    // Sin terapeuta asignado
  CONFIRMED: 2,  // Con terapeuta asignado
  COMPLETED: 3,  // Cita completada
  CANCELLED: 4,  // Cita cancelada
};

// Tipos de cita
export const APPOINTMENT_TYPES = {
  CONSULTATION: 'CC',      // Consulta
  FOLLOWUP: 'SG',         // Seguimiento
  EMERGENCY: 'EM',        // Emergencia
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
};

// Delays para UI (en milisegundos)
export const UI_DELAYS = {
  SEARCH_DEBOUNCE: 500,    // Debounce para búsqueda
  SUCCESS_REDIRECT: 1500,  // Tiempo antes de redireccionar después de éxito
  TOAST_DURATION: 3000,    // Duración de notificaciones
};

// Días para calcular fecha final de tratamiento
export const TREATMENT_DURATION_DAYS = 5;

// Información de la empresa para PDFs
export const COMPANY_INFO = {
  name: 'REFLEXOPERU',
  address: 'Calle Las Golondrinas N° 153 - Urb. Los Nogales',
  phone: '01-503-8416',
  email: 'reflexoperu@reflexoperu.com',
  city: 'LIMA - PERU',
  exonerated: 'EXONERADO DE TRIBUTOS',
  di: 'D.I. 626-D.I.23211',
};

// Opciones de respuesta binaria
export const BINARY_OPTIONS = {
  YES: 'Sí',
  NO: 'No',
};

// Sexos
export const SEX = {
  FEMALE: 'F',
  MALE: 'M',
};

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_NUMBER: 'Solo se permiten números enteros o decimales',
  INVALID_DATE: 'Fecha inválida',
  MISSING_APPOINTMENT_ID: 'Falta el ID de la cita',
  MISSING_HISTORY_ID: 'Falta el ID del historial',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  HISTORY_UPDATED: 'Historia clínica actualizada correctamente',
  APPOINTMENT_UPDATED: 'Cita modificada correctamente',
  CHANGES_SAVED: 'Cambios guardados exitosamente',
  HISTORY_CREATED: 'Historia clínica creada correctamente',
};

// Mensajes de error
export const ERROR_MESSAGES = {
  HISTORY_UPDATE_FAILED: 'No se pudo actualizar la historia clínica',
  APPOINTMENT_UPDATE_FAILED: 'No se pudo actualizar la cita',
  FETCH_FAILED: 'Error al obtener los datos',
  GENERIC_ERROR: 'Ha ocurrido un error. Por favor intente nuevamente',
};

// Configuración de formateo de números
export const NUMBER_FORMAT = {
  WEIGHT_DECIMALS: 2,
  HEIGHT_DECIMALS: 2,
};

// Ancho de modales
export const MODAL_WIDTHS = {
  THERAPIST_LIST: 730,
  TICKET_PREVIEW: 420,
  FICHA_PREVIEW: 420,
};

// Configuración de PDFViewer
export const PDF_VIEWER_CONFIG = {
  TICKET_HEIGHT: 600,
  FICHA_HEIGHT: 800,
  DEFAULT_WIDTH: '100%',
  SHOW_TOOLBAR: true,
};

