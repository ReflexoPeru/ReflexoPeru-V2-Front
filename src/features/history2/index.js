/**
 * Punto de entrada principal del módulo history2
 * Exporta el componente principal y utilidades públicas
 */

export { default } from './PatientHistory';
export { default as PatientHistory } from './PatientHistory';

// Exportar hooks para uso externo si es necesario
export {
  usePatientHistory,
  useUpdatePatientHistory,
  usePatientAppointments,
  useUpdateAppointment,
} from './hooks/usePatientHistory';

export { useTherapists, useTherapistSelection } from './hooks/useTherapists';

// Exportar constantes útiles
export {
  APPOINTMENT_STATUS,
  BINARY_OPTIONS,
  SEX,
  CONTRACEPTIVE_METHOD_IDS,
} from './constants';

// Exportar helpers de formateo
export { formatTherapistName } from './api/therapistApi';
export { isFemalePatient } from './utils/formHelpers';

