import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Spin,
  Typography,
} from 'antd';
import dayjs from '../../utils/dayjsConfig';

// Hooks
import {
  usePatientHistory,
  usePatientAppointments,
  useUpdatePatientHistory,
  useUpdateAppointment,
} from './hooks/usePatientHistory';
import { useTherapists, useTherapistSelection } from './hooks/useTherapists';

// Components
import TherapistModal from './components/TherapistModal';
import WeightFields from './components/WeightFields';
import ContraceptiveFields from './components/ContraceptiveFields';
import MedicalFields from './components/MedicalFields';
import { TicketModal, FichaModal } from './components/PDFModals';

// Utils
import {
  buildFormInitialValues,
  buildAppointmentFormValues,
  buildHistoryPayload,
  buildAppointmentPayload,
  isFemalePatient,
  updateWeightFieldsAfterSave,
  normalizeContraceptiveData,
} from './utils/formHelpers';
import { validateAppointmentId } from './utils/validators';

// API
import {
  extractUniqueDates,
  findAppointmentByDate,
} from './api/appointmentApi';
import { formatTherapistName } from './api/therapistApi';

// Constants
import {
  VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
  UI_DELAYS,
} from './constants';

// Styles
import styles from './PatientHistory.module.css';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/**
 * Componente principal de Historia del Paciente - Versión 2 Mejorada
 * 
 * Mejoras implementadas:
 * - Separación clara de responsabilidades
 * - Hooks especializados para cada funcionalidad
 * - Componentes modulares reutilizables
 * - Mejor manejo de errores y estados de carga
 * - Validaciones centralizadas
 * - Código más mantenible y testeable
 */
const PatientHistory = () => {
  // ==================== HOOKS Y ESTADO ====================
  const [form] = Form.useForm();
  const { id: patientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Estado de cita
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState('');
  const appointmentFromState = location.state?.appointment;

  // Estado de modales
  const [isTherapistModalVisible, setIsTherapistModalVisible] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showFichaModal, setShowFichaModal] = useState(false);

  // Estado de anticonceptivos
  const [useContraceptiveMethodState, setUseContraceptiveMethodState] = useState(null);
  const [contraceptiveMethodId, setContraceptiveMethodId] = useState(null);
  const [diuTypeId, setDiuTypeId] = useState(null);

  // Hooks de datos
  const {
    history: patientHistory,
    loading: loadingHistory,
    refetch: refetchHistory,
  } = usePatientHistory(patientId);

  const {
    appointments,
    lastAppointment,
    patient,
    loading: loadingAppointments,
    refetch: refetchAppointments,
  } = usePatientAppointments(patientId);

  // Hook para terapeutas (NO carga automáticamente)
  const {
    therapists,
    loading: loadingTherapists,
    pagination,
    handlePageChange,
    handleSearchChange,
    clearSearch,
    initializeLoad: initializeTherapistLoad,
  } = useTherapists();

  // Hook para selección de terapeuta
  const {
    selectedTherapist,
    selectedTherapistId,
    selectTherapist,
    clearTherapist,
  } = useTherapistSelection();

  // Hook para actualizaciones (sin callback, recargamos manualmente después del guardado)
  const { updateHistory, updating: updatingHistory } =
    useUpdatePatientHistory(patientId);

  const { updateAppointment, updating: updatingAppointment } =
    useUpdateAppointment();

  // ==================== COMPUTED VALUES ====================
  const isFemale = useMemo(
    () => isFemalePatient(patientHistory, patient),
    [patientHistory, patient]
  );

  const appointmentDates = useMemo(
    () => extractUniqueDates(appointments),
    [appointments]
  );

  const selectedAppointment = useMemo(
    () => findAppointmentByDate(appointments, selectedAppointmentDate),
    [appointments, selectedAppointmentDate]
  );

  const isLoading = loadingHistory || loadingAppointments;
  const isSaving = updatingHistory || updatingAppointment;

  // ==================== EFFECTS ====================
  
  /**
   * Effect: Cargar datos iniciales del historial en el formulario
   * IMPORTANTE: Espera a que terminen de cargar tanto el historial como las citas
   * para asegurar que tengamos los datos del paciente disponibles
   */
  useEffect(() => {
    // Esperar a que terminen de cargar ambos datos
    if (loadingHistory || loadingAppointments) return;
    if (!patientHistory?.data) return;

    const initialValues = buildFormInitialValues(
      patientHistory,
      appointments,
      isFemale,
      patient
    );
    form.setFieldsValue(initialValues);

    // Configurar terapeuta del historial
    if (patientHistory.data.therapist) {
      const therapistName = formatTherapistName(patientHistory.data.therapist);
      const therapist = {
        id: patientHistory.data.therapist.id,
        name: therapistName,
      };
      selectTherapist(therapist);
    }

    // Configurar estado de anticonceptivos para mujeres
    if (isFemale && patientHistory.data) {
      const contraceptiveData = normalizeContraceptiveData(
        patientHistory.data
      );
      setUseContraceptiveMethodState(contraceptiveData.useMethod);
      setContraceptiveMethodId(contraceptiveData.methodId);
      setDiuTypeId(contraceptiveData.diuId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientHistory, loadingHistory, loadingAppointments, isFemale, patient, appointments]);

  /**
   * Effect: Cargar datos de la cita seleccionada
   * CRÍTICO: Limpia el terapeuta si la cita no tiene uno asignado
   */
  useEffect(() => {
    if (!selectedAppointment) {
      clearTherapist(); // Limpia si no hay cita seleccionada
      return;
    }

    const appointmentValues = buildAppointmentFormValues(selectedAppointment);
    form.setFieldsValue(appointmentValues);

    // Actualizar o limpiar terapeuta según la cita
    if (selectedAppointment.therapist) {
      // La cita TIENE terapeuta → asignarlo
      const therapistName = formatTherapistName(selectedAppointment.therapist);
      const therapist = {
        id: selectedAppointment.therapist.id,
        name: therapistName,
      };
      selectTherapist(therapist);
    } else {
      // La cita NO TIENE terapeuta → limpiar (FIX crítico)
      clearTherapist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAppointment]);

  /**
   * Effect: Selección automática de fecha de cita
   */
  useEffect(() => {
    if (!appointments || appointments.length === 0) return;

    // Prioridad 1: Cita pasada desde navegación
    if (appointmentFromState?.appointment_date) {
      setSelectedAppointmentDate(appointmentFromState.appointment_date);
    }
    // Prioridad 2: Última cita (más reciente)
    else if (lastAppointment?.appointment_date) {
      setSelectedAppointmentDate(lastAppointment.appointment_date);
    }
  }, [appointmentFromState, lastAppointment, appointments]);

  // ==================== HANDLERS ====================

  /**
   * Handler: Abrir modal de terapeutas (carga datos solo al abrir)
   */
  const handleOpenTherapistModal = useCallback(() => {
    initializeTherapistLoad(); // Carga solo cuando se abre el modal
    setIsTherapistModalVisible(true);
  }, [initializeTherapistLoad]);

  /**
   * Handler: Cerrar modal de terapeutas
   */
  const handleCloseTherapistModal = useCallback(() => {
    setIsTherapistModalVisible(false);
    clearSearch();
  }, [clearSearch]);

  /**
   * Handler: Confirmar selección de terapeuta
   */
  const handleConfirmTherapist = useCallback(() => {
    if (selectedTherapistId) {
      const therapist = therapists.find((t) => t.id === selectedTherapistId);
      if (therapist) {
        const therapistName = formatTherapistName(therapist);
        selectTherapist({ id: therapist.id, name: therapistName });
        form.setFieldsValue({ therapist: therapistName });
      }
    }
    handleCloseTherapistModal();
  }, [
    selectedTherapistId,
    therapists,
    form,
    selectTherapist,
    handleCloseTherapistModal,
  ]);

  /**
   * Handler: Seleccionar terapeuta en el modal
   */
  const handleSelectTherapist = useCallback(
    (id) => {
      const therapist = therapists.find((t) => t.id === id);
      if (therapist) {
        selectTherapist({ id, name: formatTherapistName(therapist) });
      }
    },
    [therapists, selectTherapist]
  );

  /**
   * Handler: Eliminar terapeuta seleccionado
   */
  const handleRemoveTherapist = useCallback(() => {
    clearTherapist();
    form.setFieldsValue({ therapist: '' });
  }, [clearTherapist, form]);

  /**
   * Handler: Cambio de método anticonceptivo
   */
  const handleContraceptiveMethodChange = useCallback((value) => {
    setUseContraceptiveMethodState(value);
  }, []);

  const handleContraceptiveChange = useCallback((value) => {
    setContraceptiveMethodId(value);
    form.setFieldsValue({ contraceptive_method_id: value });
  }, [form]);

  const handleDiuTypeChange = useCallback((value) => {
    setDiuTypeId(value);
    form.setFieldsValue({ diu_type_id: value });
  }, [form]);

  /**
   * Handler: Envío del formulario
   */
  const handleSubmit = useCallback(
    async (values) => {
      // Validar que exista una cita seleccionada
      if (!validateAppointmentId(selectedAppointment?.id)) {
        message.error(VALIDATION_MESSAGES.MISSING_APPOINTMENT_ID);
        return;
      }

      const historyId = patientHistory?.data?.id;
      const appointmentId = selectedAppointment.id;

      // Construir payloads
      const contraceptiveState = {
        useContraceptiveMethod: useContraceptiveMethodState,
        contraceptiveMethodId,
        diuTypeId,
      };

      const historyPayload = buildHistoryPayload(
        values,
        patientHistory,
        contraceptiveState,
        selectedTherapistId
      );

      const appointmentPayload = buildAppointmentPayload(
        values,
        selectedAppointment,
        selectedAppointmentDate,
        selectedTherapistId,
        patientId
      );

      // Guardar cambios (secuencialmente)
      try {
        const [historyResult, appointmentResult] = await Promise.all([
          updateHistory(historyId, historyPayload),
          updateAppointment(appointmentId, appointmentPayload),
        ]);

        if (historyResult.success && appointmentResult.success) {
          message.success(SUCCESS_MESSAGES.CHANGES_SAVED, 8); // Duración de 8 segundos

          // Actualizar campos de peso en el formulario
          updateWeightFieldsAfterSave(form, values);

          // Refrescar datos desde el backend para mantener sincronización
          // Esto asegura que cualquier cálculo del servidor se refleje
          await Promise.all([
            refetchHistory(),
            refetchAppointments(),
          ]);

          // El usuario permanece en la vista para seguir trabajando
          console.log('[PatientHistory] Datos actualizados exitosamente');
        } else {
          message.error('Error al guardar algunos cambios');
        }
      } catch (error) {
        console.error('[PatientHistory] Error saving:', error);
        message.error(`Error al guardar: ${error.message}`);
      }
    },
    [
      selectedAppointment,
      patientHistory,
      useContraceptiveMethodState,
      contraceptiveMethodId,
      diuTypeId,
      selectedTherapistId,
      selectedAppointmentDate,
      patientId,
      updateHistory,
      updateAppointment,
      form,
      refetchHistory,
      refetchAppointments,
    ]
  );

  // ==================== RENDER ====================

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Spin
          size="large"
          tip="Cargando datos del paciente..."
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
          }}
        />
      </div>
    );
  }

  // Validación: Asegurar que tengamos datos del paciente antes de renderizar
  const hasPatientData = patient || 
                         patientHistory?.data?.patient || 
                         (appointments && appointments.length > 0 && appointments[0]?.patient);

  if (!hasPatientData && !isLoading) {
    console.warn('[PatientHistory] No se encontraron datos del paciente', {
      patient,
      historyPatient: patientHistory?.data?.patient,
      appointmentPatient: appointments?.[0]?.patient,
    });
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={2} className={styles.title}>
          Historial del Paciente
        </Title>

        <Form
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
          className={styles.form}
        >
          {/* Información del Paciente */}
          <Form.Item
            name="patientName"
            label="Paciente"
            className={styles.formItem}
          >
            <Input disabled className={styles.input} />
          </Form.Item>

          <Form.Item
            name="observation"
            label="Observación General"
            className={styles.formItem}
          >
            <TextArea rows={3} className={styles.textarea} />
          </Form.Item>

          {/* Selector de Cita y Terapeuta en la misma fila */}
          <Title level={3} className={styles.sectionTitle}>
            Información de la Cita
          </Title>

          <div className={styles.appointmentRow}>
            <Form.Item label="Fecha de la Cita" className={styles.dateFormItem}>
              <Select
                value={selectedAppointmentDate}
                onChange={setSelectedAppointmentDate}
                className={styles.select}
                placeholder="Seleccione una fecha"
                loading={loadingAppointments}
              >
                {appointmentDates.map((date) => (
                  <Option key={date} value={date}>
                    {dayjs(date).format('DD-MM-YYYY')}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="therapist"
              label="Terapeuta Asignado"
              className={styles.therapistFormItem}
            >
              <div className={styles.therapistRow}>
                <Input
                  disabled
                  value={selectedTherapist?.name || 'No asignado'}
                  className={styles.therapistInput}
                  placeholder="Seleccione un terapeuta"
                />
                <Button
                  type="primary"
                  onClick={handleOpenTherapistModal}
                  className={styles.selectButton}
                >
                  Seleccionar
                </Button>
                {selectedTherapist && (
                  <Button
                    danger
                    onClick={handleRemoveTherapist}
                    className={styles.removeButton}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </Form.Item>
          </div>

          {/* Campos Médicos */}
          <MedicalFields styles={styles} />

          {/* Campos de Peso, Talla y datos reproductivos */}
          <Title level={3} className={styles.sectionTitle}>
            Métricas Físicas
          </Title>
          <WeightFields styles={styles} isFemale={isFemale} />

          {/* Campos de Anticonceptivos (solo mujeres) */}
          <ContraceptiveFields
            isFemale={isFemale}
            useContraceptiveMethod={useContraceptiveMethodState}
            contraceptiveMethodId={contraceptiveMethodId}
            diuTypeId={diuTypeId}
            onContraceptiveMethodChange={handleContraceptiveMethodChange}
            onContraceptiveChange={handleContraceptiveChange}
            onDiuTypeChange={handleDiuTypeChange}
            form={form}
            styles={styles}
          />

          {/* Sección Inferior: Fecha de Inicio y Botones */}
          <div className={styles.bottomSection}>
            <Form.Item
              name="fechaInicio"
              label="Fecha de Inicio"
              className={styles.startDateSection}
            >
              <DatePicker className={styles.datePicker} format="DD-MM-YYYY" />
            </Form.Item>

            <div className={styles.actionButtons}>
              <Button
                className={styles.printButton}
                onClick={() => setShowTicketModal(true)}
                disabled={!selectedAppointment}
              >
                Generar Boleta
              </Button>
              <Button
                className={styles.printButton}
                onClick={() => setShowFichaModal(true)}
                disabled={!selectedAppointment}
              >
                Generar Ficha
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.saveButton}
                loading={isSaving}
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button
                className={styles.cancelButton}
                onClick={() => navigate(-1)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Form>
      </Card>

      {/* Modales */}
      <TherapistModal
        visible={isTherapistModalVisible}
        onCancel={handleCloseTherapistModal}
        onConfirm={handleConfirmTherapist}
        therapists={therapists}
        loading={loadingTherapists}
        selectedTherapistId={selectedTherapistId}
        onSelectTherapist={handleSelectTherapist}
        onSearch={handleSearchChange}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <TicketModal
        visible={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        appointment={selectedAppointment}
        patientHistory={patientHistory}
        patient={patient}
      />

      <FichaModal
        visible={showFichaModal}
        onClose={() => setShowFichaModal(false)}
        appointment={selectedAppointment}
        patientHistory={patientHistory}
        appointmentsCount={appointments.length}
        patient={patient}
      />
    </div>
  );
};

export default PatientHistory;

