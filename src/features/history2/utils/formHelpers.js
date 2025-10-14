import dayjs from '../../../utils/dayjsConfig';
import {
  formatNumberForDisplay,
  formatNumberForBackend,
  formatHeight,
  formatWeight,
} from '../../../utils/numberFormatter';
import {
  BINARY_OPTIONS,
  SEX,
  CONTRACEPTIVE_METHOD_IDS,
  APPOINTMENT_STATUS,
  TREATMENT_DURATION_DAYS,
} from '../constants';

/**
 * Helpers para manejo de formularios
 * Centraliza la lógica de transformación de datos
 */

/**
 * Sanitiza campos de texto médicos para garantizar guardado correcto
 * - Elimina espacios innecesarios al inicio y final
 * - Convierte strings vacíos a null para BD
 * - Preserva contenido real del usuario
 * - Normaliza saltos de línea
 * 
 * @param {string} value - Valor del campo
 * @returns {string|null} Valor sanitizado o null
 */
export const sanitizeMedicalField = (value) => {
  // Si es null, undefined o no es string, retorna null
  if (value === null || value === undefined || typeof value !== 'string') {
    return null;
  }
  
  // Trim de espacios al inicio y final
  const trimmed = value.trim();
  
  // Si quedó vacío después del trim, retorna null (mejor para BD)
  if (trimmed.length === 0) {
    return null;
  }
  
  // Normaliza saltos de línea múltiples (máximo 2 consecutivos)
  const normalized = trimmed.replace(/\n{3,}/g, '\n\n');
  
  return normalized;
};

/**
 * Construye valores iniciales del formulario desde los datos del historial
 * @param {Object} patientHistory - Datos del historial
 * @param {Array} appointments - Lista de citas
 * @param {boolean} isFemale - Si el paciente es mujer
 * @param {Object} patient - Datos del paciente (opcional, se obtiene de appointments si no se provee)
 * @returns {Object} Valores para el formulario
 */
export const buildFormInitialValues = (patientHistory, appointments, isFemale, patient = null) => {
  if (!patientHistory?.data) {
    return {};
  }

  const historyData = patientHistory.data;
  
  // Obtener paciente de varias fuentes posibles (nueva API, historial, o citas)
  const patientData = patient || historyData.patient || (appointments && appointments.length > 0 ? appointments[0].patient : null);

  const formValues = {
    // Información del paciente
    patientName: patientData
      ? `${patientData.paternal_lastname || ''} ${patientData.maternal_lastname || ''} ${patientData.name || ''}`.trim()
      : '',

    // Observaciones
    observationPrivate: historyData.private_observation || '',
    observation: historyData.observation || '',

    // Medidas físicas (formateadas para display)
    talla: formatHeight(historyData.height),
    pesoInicial: formatWeight(historyData.weight),
    ultimoPeso: formatWeight(historyData.last_weight),
    pesoHoy: formatWeight(historyData.current_weight),

    // Campos booleanos
    testimonio: historyData.testimony ? BINARY_OPTIONS.YES : BINARY_OPTIONS.NO,

    // Fecha de inicio (primera cita o hoy)
    fechaInicio:
      appointments && appointments.length > 0
        ? dayjs(appointments[0].appointment_date)
        : dayjs(),
  };

  // Campos específicos para mujeres
  if (isFemale) {
    formValues.gestacion = historyData.gestation
      ? BINARY_OPTIONS.YES
      : BINARY_OPTIONS.NO;
    formValues.menstruacion = historyData.menstruation
      ? BINARY_OPTIONS.YES
      : BINARY_OPTIONS.NO;
    formValues.use_contraceptive_method =
      historyData.use_contraceptive_method ?? null;
    formValues.contraceptive_method_id =
      historyData.contraceptive_method_id ?? null;
    formValues.diu_type_id = historyData.diu_type_id ?? null;
  }

  return formValues;
};

/**
 * Construye valores del formulario desde una cita seleccionada
 * @param {Object} appointment - Cita seleccionada
 * @returns {Object} Valores para el formulario
 */
export const buildAppointmentFormValues = (appointment) => {
  if (!appointment) {
    return {};
  }

  const therapistObj = appointment.therapist;
  const therapistName = therapistObj
    ? `${therapistObj.paternal_lastname || ''} ${therapistObj.maternal_lastname || ''} ${therapistObj.name || ''}`.trim()
    : '';

  return {
    diagnosticosMedicos: appointment.diagnosis ?? '',
    dolencias: appointment.ailments ?? '',
    medicamentos: appointment.medications ?? '',
    operaciones: appointment.surgeries ?? '',
    observacionesAdicionales: appointment.observation ?? '',
    diagnosticosReflexologia: appointment.reflexology_diagnostics ?? '',
    therapist: therapistName,
  };
};

/**
 * Calcula la lógica de actualización de peso
 * Si hay "peso hoy", mueve el peso actual a "peso anterior"
 * @param {Object} values - Valores del formulario
 * @param {Object} currentHistory - Historial actual
 * @returns {Object} {last_weight, current_weight}
 */
export const calculateWeightUpdate = (values, currentHistory) => {
  const currentWeight = currentHistory?.data?.current_weight || currentHistory?.data?.last_weight || '';

  if (values.pesoHoy) {
    return {
      last_weight: formatNumberForBackend(currentWeight),
      current_weight: formatNumberForBackend(values.pesoHoy),
    };
  }

  return {
    last_weight: formatNumberForBackend(values.ultimoPeso),
    current_weight: null,
  };
};

/**
 * Construye el payload para actualizar el historial
 * Incluye normalización y validación de datos
 * @param {Object} values - Valores del formulario
 * @param {Object} currentHistory - Historial actual
 * @param {Object} contraceptiveState - Estado de anticonceptivos
 * @param {number} selectedTherapistId - ID del terapeuta seleccionado
 * @returns {Object} Payload para la API
 */
export const buildHistoryPayload = (
  values,
  currentHistory,
  contraceptiveState,
  selectedTherapistId
) => {
  const { useContraceptiveMethod, contraceptiveMethodId, diuTypeId } =
    contraceptiveState;

  const weightUpdate = calculateWeightUpdate(values, currentHistory);

  return {
    // Medidas físicas
    weight: formatNumberForBackend(values.pesoInicial),
    last_weight: weightUpdate.last_weight,
    current_weight: weightUpdate.current_weight,
    height: formatNumberForBackend(values.talla, 2),

    // Observaciones
    observation: values.observation || null,
    private_observation: values.observationPrivate || null,

    // Campos médicos (con sanitización robusta)
    diagnosticos_medicos: sanitizeMedicalField(values.diagnosticosMedicos),
    operaciones: sanitizeMedicalField(values.operaciones),
    medicamentos: sanitizeMedicalField(values.medicamentos),
    dolencias: sanitizeMedicalField(values.dolencias),
    diagnosticos_reflexologia: sanitizeMedicalField(values.diagnosticosReflexologia),
    observaciones_adicionales: sanitizeMedicalField(values.observacionesAdicionales),
    antecedentes_familiares: sanitizeMedicalField(values.antecedentesFamiliares),
    alergias: sanitizeMedicalField(values.alergias),

    // Campos booleanos
    testimony: values.testimonio === BINARY_OPTIONS.YES,
    gestation: values.gestacion === BINARY_OPTIONS.YES,
    menstruation: values.menstruacion === BINARY_OPTIONS.YES,

    // Anticonceptivos (lógica condicional)
    use_contraceptive_method: useContraceptiveMethod,
    contraceptive_method_id: useContraceptiveMethod
      ? contraceptiveMethodId ?? null
      : null,
    diu_type_id:
      useContraceptiveMethod &&
      Number(contraceptiveMethodId) === CONTRACEPTIVE_METHOD_IDS.DIU
        ? diuTypeId ?? null
        : null,

    // Terapeuta
    therapist_id: selectedTherapistId || null,
  };
};

/**
 * Construye el payload para actualizar la cita
 * @param {Object} values - Valores del formulario
 * @param {Object} selectedAppointment - Cita seleccionada
 * @param {string} selectedAppointmentDate - Fecha de la cita
 * @param {number} selectedTherapistId - ID del terapeuta
 * @param {number} patientId - ID del paciente
 * @returns {Object} Payload para la API
 */
export const buildAppointmentPayload = (
  values,
  selectedAppointment,
  selectedAppointmentDate,
  selectedTherapistId,
  patientId
) => {
  const hasTherapist = Boolean(selectedTherapistId);
  const appointmentStatusId = hasTherapist
    ? APPOINTMENT_STATUS.CONFIRMED
    : APPOINTMENT_STATUS.PENDING;

  return {
    appointment_date: selectedAppointmentDate,
    // Campos médicos con sanitización robusta
    ailments: sanitizeMedicalField(values.dolencias),
    diagnosis: sanitizeMedicalField(values.diagnosticosMedicos),
    surgeries: sanitizeMedicalField(values.operaciones),
    reflexology_diagnostics: sanitizeMedicalField(values.diagnosticosReflexologia),
    medications: sanitizeMedicalField(values.medicamentos),
    observation: sanitizeMedicalField(values.observacionesAdicionales),
    initial_date: dayjs(values.fechaInicio).format('YYYY-MM-DD'),
    final_date: dayjs(values.fechaInicio)
      .add(TREATMENT_DURATION_DAYS, 'day')
      .format('YYYY-MM-DD'),
    appointment_type: selectedAppointment?.appointment_type || 'CC',
    payment: selectedAppointment?.payment || '50.00',
    appointment_status_id: appointmentStatusId,
    patient_id: patientId,
    therapist_id: selectedTherapistId || null,
  };
};

/**
 * Determina si el paciente es mujer
 * @param {Object} patientHistory - Historial del paciente
 * @param {Object} patient - Datos del paciente (opcional)
 * @returns {boolean}
 */
export const isFemalePatient = (patientHistory, patient = null) => {
  // Intentar obtener el paciente de varias fuentes
  const patientData = patient || patientHistory?.data?.patient;
  return patientData?.sex === SEX.FEMALE;
};

/**
 * Actualiza los campos de peso en el formulario después de guardar
 * Si se ingresó "peso hoy", lo mueve a "peso anterior" y limpia "peso hoy"
 * @param {Object} form - Instancia del formulario Ant Design
 * @param {Object} values - Valores del formulario
 */
export const updateWeightFieldsAfterSave = (form, values) => {
  if (values.pesoHoy) {
    form.setFieldsValue({
      pesoHoy: '',
      ultimoPeso: formatWeight(values.pesoHoy),
    });
  }
};

/**
 * Normaliza los datos de anticonceptivos desde el historial
 * @param {Object} historyData - Datos del historial
 * @returns {Object} {useMethod, methodId, diuId, methodLabel}
 */
export const normalizeContraceptiveData = (historyData) => {
  const useMethod = historyData?.use_contraceptive_method ?? null;
  const methodId = historyData?.contraceptive_method_id ?? null;
  const diuId = historyData?.diu_type_id ?? null;

  return {
    useMethod,
    methodId,
    diuId,
    displayValue: useMethod === true ? BINARY_OPTIONS.YES : useMethod === false ? BINARY_OPTIONS.NO : '',
  };
};

